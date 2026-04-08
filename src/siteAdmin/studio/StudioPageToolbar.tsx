import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Button } from '@app/components/button';
import { Modal } from '@app/components/modal';
import { Select } from '@app/components/select';
import { TextField } from '@app/components/text-field';
import { useStudioPageContext } from './studioPageContext';

const HOME_PAGE_VALUE = '__studio_home__';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const StudioPageToolbar = observer(() => {
  const pageContext = useStudioPageContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [pageTitle, setPageTitle] = React.useState('');
  const [pageSlug, setPageSlug] = React.useState('');

  const items = React.useMemo(
    () => [
      {
        value: HOME_PAGE_VALUE,
        title: (
          <div className="flex min-w-[180px] flex-col">
            <span className="font-medium text-slate-900">Home</span>
            <span className="text-[10px] text-slate-500">/</span>
          </div>
        ),
      },
      ...pageContext.pages.map((page) => ({
        value: String(page.id),
        title: (
          <div className="flex min-w-[180px] flex-col">
            <span className="font-medium text-slate-900">{page.title}</span>
            <span className="text-[10px] text-slate-500">/{page.slug || ''}</span>
          </div>
        ),
      })),
    ],
    [pageContext.pages]
  );

  if (!pageContext.enabled) {
    return null;
  }

  return (
    <>
      <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
          Page
        </span>
        <Select
          className="min-w-[190px]"
          value={pageContext.currentPageId ? String(pageContext.currentPageId) : HOME_PAGE_VALUE}
          onChange={(value) => {
            pageContext.switchPage(value === HOME_PAGE_VALUE ? null : Number(value));
          }}
          items={items}
        />
        <Button
          size="xs"
          variant="subtle"
          className="gap-1.5"
          onClick={() => {
            setPageTitle('');
            setPageSlug('');
            setIsCreateModalOpen(true);
          }}
        >
          <PlusIcon />
          Create Page
        </Button>
        <Button
          size="xs"
          variant="outline"
          className="gap-1.5"
          disabled={!pageContext.currentPageId || pageContext.isMutating}
          onClick={() => {
            void pageContext.deleteCurrentPage();
          }}
        >
          <TrashIcon />
          Delete
        </Button>
      </div>

      <Modal
        title="Create New Page"
        description="Give the page a title and slug. Studio will open the new page right after creation."
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="mt-5 flex flex-col gap-4">
          <div className="grid w-full grid-cols-pair-input items-center gap-3">
            <span className="text-xs">Title</span>
            <TextField
              placeholder="About Us"
              value={pageTitle}
              onChange={(event) => {
                const nextTitle = event.target.value;
                setPageTitle(nextTitle);
                setPageSlug((current) => (current ? current : slugify(nextTitle)));
              }}
            />
          </div>
          <div className="grid w-full grid-cols-pair-input items-center gap-3">
            <span className="text-xs">Slug</span>
            <TextField
              placeholder="about-us"
              value={pageSlug}
              onChange={(event) => {
                setPageSlug(slugify(event.target.value));
              }}
            />
          </div>
          <Button
            variant="primary"
            disabled={!pageTitle.trim() || !pageSlug.trim() || pageContext.isMutating}
            onClick={async () => {
              await pageContext.createPage({
                title: pageTitle.trim(),
                slug: pageSlug.trim(),
              });
              setIsCreateModalOpen(false);
            }}
          >
            {pageContext.isMutating ? 'Creating...' : 'Create Page'}
          </Button>
        </div>
      </Modal>
    </>
  );
});
