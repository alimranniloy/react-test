import * as t from '@rekajs/types';

import { SettingSection } from '@app/components/settings-section';
import {
  resolveEditableTagTemplate,
} from '@app/components/editor-layout/component-settings/selected-template-controls/style-utils';
import { TemplateMediaFields } from '@app/components/editor-layout/shared/media/TemplateMediaFields';
import { useEditor } from '@app/editor';

type MediaTemplateSettingsProps = {
  template: t.Template;
};

export const MediaTemplateSettings = ({ template }: MediaTemplateSettingsProps) => {
  const editor = useEditor();
  const editableTemplate = resolveEditableTagTemplate(editor, template);

  if (
    !editableTemplate ||
    (editableTemplate.tag !== 'img' && editableTemplate.tag !== 'video')
  ) {
    return null;
  }

  return (
    <SettingSection
      title="Media"
      info="Replace media URLs, upload assets to the database and control fit or playback settings"
      collapsedOnInitial={false}
    >
      <TemplateMediaFields template={editableTemplate} variant="inspector" />
    </SettingSection>
  );
};
