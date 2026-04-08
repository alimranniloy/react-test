import {
  EXTERNAL_IDENTIFIER_PREFIX_SYMBOL,
  getIdentifierFromStr,
} from '@rekajs/parser';
import { useApolloClient, useQuery } from '@apollo/client';
import * as t from '@rekajs/types';
import { capitalize } from 'lodash';
import * as React from 'react';

import { Button } from '@app/components/button';
import { Modal } from '@app/components/modal';
import { PairInput } from '@app/components/pair-input';
import { Select } from '@app/components/select';
import { TextField } from '@app/components/text-field';
import { ToggleGroup, ToggleGroupItem } from '@app/components/toggle-group';
import { useEditor } from '@app/editor';
import { SITE_COMPONENT, SITE_COMPONENTS } from '@/graphql/queries/siteComponents';
import { createComponentFromSchemaJson } from '@/siteAdmin/editor/rekaBlocks';
import { useToastStore } from '@/siteAdmin/store/useToastStore';

type AddTemplateModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onAdd?: (template: t.Template) => void;
  allowedTplTypes?: Array<'tag' | 'slot' | 'component'>;
};

export const AddTemplateModal = (props: AddTemplateModalProps) => {
  const allowedTplTypes = props.allowedTplTypes || ['tag', 'component', 'slot'];

  const [templateType, setTemplateType] = React.useState<
    'tag' | 'component' | 'slot'
  >(allowedTplTypes[0]);

  const [templateTag, setTemplateTag] = React.useState('');
  const [templateComponentName, setTemplateComponentName] = React.useState('');
  const [showReadyComponents, setShowReadyComponents] = React.useState(false);
  const [selectedReadyComponentId, setSelectedReadyComponentId] = React.useState('');
  const [creatingReadyComponent, setCreatingReadyComponent] = React.useState(false);

  const [templateProps, setTemplateProps] = React.useState<Record<string, any>>(
    {}
  );

  const editor = useEditor();
  const apollo = useApolloClient();
  const addToast = useToastStore((s) => s.addToast);
  const readyComponentsQuery = useQuery(SITE_COMPONENTS, {
    variables: { first: 100, after: null },
    fetchPolicy: 'network-only',
    skip: templateType !== 'component',
  });

  const readyComponentItems = React.useMemo(() => {
    const edges = readyComponentsQuery.data?.siteComponents?.edges ?? [];
    return edges
      .map((edge: any) => edge?.node)
      .filter(Boolean)
      .sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0))
      .map((component: any) => ({
        value: String(component.id),
        title: component.title || component.slug || `Component #${component.id}`,
      }));
  }, [readyComponentsQuery.data]);

  const createReadyMadeComponentTemplate = React.useCallback(async () => {
    if (!selectedReadyComponentId || !props.onAdd) {
      return false;
    }

    try {
      setCreatingReadyComponent(true);

      const result = await apollo.query({
        query: SITE_COMPONENT,
        variables: { id: Number(selectedReadyComponentId) },
        fetchPolicy: 'network-only',
      });

      const siteComponent = result.data?.siteComponent;
      const component =
        createComponentFromSchemaJson(siteComponent?.componentData, editor.reka) ??
        createComponentFromSchemaJson(siteComponent?.component, editor.reka) ??
        createComponentFromSchemaJson(siteComponent, editor.reka);

      if (!component) {
        addToast({
          kind: 'error',
          title: 'Ready Component',
          subTitle: 'Component schema not found.',
        });
        return false;
      }

      editor.reka.change(() => {
        const program = editor.reka.state?.program?.components as any[] | undefined;
        if (!program) {
          return;
        }

        program.push(component);
      });

      props.onAdd(
        t.componentTemplate({
          component: t.identifier({ name: component.name, external: false }),
          props: templateProps,
          children: [],
        })
      );

      return true;
    } catch (err) {
      addToast({
        kind: 'error',
        title: 'Ready Component',
        subTitle: (err as Error).message,
      });
      return false;
    } finally {
      setCreatingReadyComponent(false);
    }
  }, [addToast, apollo, editor.reka, props, selectedReadyComponentId, templateProps]);

  return (
    <Modal title="Add template" isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col gap-4 mt-5">
        <div className="grid items-center w-full grid-cols-pair-input">
          <span className="text-xs">Type</span>
          <div>
            <ToggleGroup
              type="single"
              value={templateType}
              onValueChange={(value) => {
                setTemplateType(value as any);
              }}
            >
              {allowedTplTypes.map((type) => (
                <ToggleGroupItem key={type} value={type}>
                  {capitalize(type)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        {templateType === 'tag' && (
          <React.Fragment>
            <div className="grid items-center w-full grid-cols-pair-input">
              <span className="text-xs">Tag</span>
              <TextField
                placeholder="div"
                onChange={(e) => {
                  setTemplateTag(e.target.value);
                }}
              />
            </div>
          </React.Fragment>
        )}
        {templateType === 'component' && (
          <React.Fragment>
            <div className="grid items-center w-full grid-cols-pair-input">
              <span className="text-xs">Component</span>
              <div>
                <Select
                  value={templateComponentName}
                  onChange={(value) => {
                    setTemplateComponentName(value);
                    setSelectedReadyComponentId('');
                  }}
                  items={[
                    ...editor.reka.components.externals.map((component) => ({
                      value: `${EXTERNAL_IDENTIFIER_PREFIX_SYMBOL}${component.name}`,
                      title: (
                        <span>
                          {component.name}{' '}
                          <span className="ml-1 rounded-full py-0.5 px-2 text-xs bg-secondary-100 text-secondary ">
                            React
                          </span>
                        </span>
                      ),
                    })),
                    ...editor.reka.components.program.map((component) => ({
                      value: component.name,
                      title: component.name,
                    })),
                  ]}
                />
              </div>
            </div>

            <div className="ml-[80px] rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-medium text-slate-900">
                    Ready-made Components
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    এখান থেকে আমাদের ready components select করে direct create করতে পারবে
                  </div>
                </div>
                <Button
                  type="button"
                  size="xs"
                  variant="secondary"
                  onClick={() => {
                    setShowReadyComponents((current) => !current);
                  }}
                >
                  {showReadyComponents ? 'Hide List' : 'Show List'}
                </Button>
              </div>

              {showReadyComponents ? (
                <div className="mt-3">
                  <Select
                    className="w-full"
                    value={selectedReadyComponentId}
                    onChange={(value) => {
                      setSelectedReadyComponentId(value);
                      setTemplateComponentName('');
                    }}
                    placeholder={
                      readyComponentsQuery.loading
                        ? 'Loading ready components...'
                        : 'Select ready-made component'
                    }
                    items={readyComponentItems}
                  />
                </div>
              ) : null}
            </div>
          </React.Fragment>
        )}
        {(templateType === 'tag' || templateType === 'component') && (
          <div className="grid items-start w-full grid-cols-pair-input">
            <span className="mt-2 text-xs">Props</span>
            <div>
              <PairInput
                addingNewField={true}
                onRemove={(id) => {
                  setTemplateProps((props) => {
                    delete props[id];

                    return {
                      ...props,
                    };
                  });
                }}
                onChange={(id, value) => {
                  setTemplateProps((props) => {
                    return {
                      ...props,
                      [id]: value,
                    };
                  });
                }}
                values={Object.keys(templateProps).reduce((accum, key) => {
                  accum.push({
                    id: key,
                    value: templateProps[key],
                  });
                  return accum;
                }, [] as any)}
              />
            </div>
          </div>
        )}

        <Button
          variant="primary"
          className="mt-3 justify-center text-sm"
          onClick={async (e) => {
            e.stopPropagation();

            if (!props.onAdd) {
              return;
            }

            if (templateType === 'tag') {
              if (!templateTag) {
                return;
              }

              props.onAdd(
                t.tagTemplate({
                  tag: templateTag,
                  props: templateProps,
                  children: [],
                  each: undefined,
                  if: undefined,
                })
              );

              return;
            }

            if (templateType === 'component') {
              if (selectedReadyComponentId) {
                await createReadyMadeComponentTemplate();
                return;
              }

              if (!templateComponentName) {
                return;
              }

              props.onAdd(
                t.componentTemplate({
                  component: getIdentifierFromStr(templateComponentName),
                  props: templateProps,
                  children: [],
                })
              );

              return;
            }

            props.onAdd(
              t.slotTemplate({
                props: {},
              })
            );
          }}
        >
          {selectedReadyComponentId
            ? creatingReadyComponent
              ? 'Creating component...'
              : 'Create component'
            : 'Add template'}
        </Button>
      </div>
    </Modal>
  );
};
