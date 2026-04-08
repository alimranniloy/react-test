import * as React from 'react';

type ControlFieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export const ControlField = (props: ControlFieldProps) => {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-slate-700">
          {props.label}
        </span>
        {props.hint ? (
          <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {props.hint}
          </span>
        ) : null}
      </div>
      {props.children}
    </label>
  );
};
