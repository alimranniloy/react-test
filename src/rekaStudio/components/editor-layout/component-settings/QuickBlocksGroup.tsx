import { ChevronRightIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { cn } from '@app/utils';

type QuickBlocksGroupProps = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export const QuickBlocksGroup = (props: QuickBlocksGroupProps) => {
  const [isOpen, setIsOpen] = React.useState(props.defaultOpen ?? false);

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-3 text-left"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>
          <div className="text-[12px] font-semibold text-slate-900">
            {props.title}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            {props.count} items
          </div>
        </div>
        <ChevronRightIcon
          className={cn('transition', {
            'rotate-90': isOpen,
          })}
        />
      </button>
      {isOpen ? <div className="px-3 pb-3">{props.children}</div> : null}
    </div>
  );
};
