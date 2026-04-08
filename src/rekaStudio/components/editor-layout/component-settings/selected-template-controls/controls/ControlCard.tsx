import * as React from 'react';

import { cn } from '@app/utils';

type ControlCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export const ControlCard = (props: ControlCardProps) => {
  return (
    <section
      className={cn(
        'rounded-[16px] border border-slate-200 bg-slate-50/85 p-3.5',
        props.className
      )}
    >
      <div className="mb-3 border-b border-slate-100 pb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {props.eyebrow}
        </div>
        <div className="mt-1 text-[14px] font-semibold text-slate-900">
          {props.title}
        </div>
        {props.description ? (
          <div className="mt-1 text-[11px] leading-5 text-slate-500">
            {props.description}
          </div>
        ) : null}
      </div>
      <div className="space-y-3">{props.children}</div>
    </section>
  );
};
