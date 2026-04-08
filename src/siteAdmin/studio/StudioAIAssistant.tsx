import { Sparkles } from 'lucide-react';

import { Button } from '@app/components/button';
import { cn } from '@app/utils';

import { useStudioAIContext } from './studioAIContext';

type StudioAIAssistantProps = {
  variant?: 'default' | 'header';
};

export const StudioAIAssistant = (props: StudioAIAssistantProps) => {
  const studioAI = useStudioAIContext();
  const variant = props.variant ?? 'default';

  return (
    <Button
      variant={variant === 'header' ? 'default' : 'secondary'}
      className={cn(
        variant === 'header'
          ? 'h-9 gap-1.5 rounded-[9px] border border-[#2d6cff] bg-[#145dff] px-3.5 text-[12px] font-semibold text-white shadow-[0_6px_16px_rgba(20,93,255,0.24)] hover:bg-[#0f54eb]'
          : 'gap-2 rounded-full border px-4',
        variant === 'default' &&
          (studioAI.isOpen
            ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
      )}
      disabled={studioAI.disabled}
      onClick={studioAI.toggle}
    >
      <Sparkles size={14} />
      {variant === 'header'
        ? 'AI'
        : studioAI.isOpen
          ? 'Hide AI'
          : 'Make with AI'}
    </Button>
  );
};
