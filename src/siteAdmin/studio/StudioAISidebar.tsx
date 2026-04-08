import { ReloadIcon } from '@radix-ui/react-icons';
import { MessageSquarePlus, Sparkles, Trash2, X } from 'lucide-react';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { Button } from '@app/components/button';
import { cn } from '@app/utils';

import { useStudioAIContext } from './studioAIContext';

const MessageBubble = ({
  role,
  content,
  warnings,
}: {
  role: 'user' | 'assistant' | 'error';
  content: string;
  warnings: string[];
}) => {
  return (
    <div
      className={cn('flex w-full', {
        'justify-end': role === 'user',
        'justify-start': role !== 'user',
      })}
    >
      <div
        className={cn(
          'max-w-[92%] rounded-[22px] px-4 py-3 text-[12px] leading-6 shadow-sm',
          {
            'bg-slate-900 text-white': role === 'user',
            'border border-slate-200 bg-white text-slate-700': role === 'assistant',
            'border border-rose-200 bg-rose-50 text-rose-700': role === 'error',
          }
        )}
      >
        <div
          className={cn('mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]', {
            'text-slate-300': role === 'user',
            'text-slate-400': role === 'assistant',
            'text-rose-400': role === 'error',
          })}
        >
          {role === 'user' ? 'You' : role === 'assistant' ? 'AI' : 'Error'}
        </div>
        <div className="whitespace-pre-wrap break-words">{content}</div>

        {warnings.length ? (
          <div className="mt-3 rounded-[16px] border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
            <div className="font-semibold text-amber-900">Warnings</div>
            <ul className="mt-1 list-disc pl-4">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const StudioAISidebar = () => {
  const studioAI = useStudioAIContext();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = scrollRef.current;

    if (!node) {
      return;
    }

    node.scrollTo({
      top: node.scrollHeight,
      behavior: 'smooth',
    });
  }, [studioAI.messages, studioAI.isRunning]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[radial-gradient(circle_at_top,#f8fbff_0%,#ffffff_42%,#f8fafc_100%)]">
      <div className="border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <Sparkles size={12} />
              Make with AI
            </div>
            <div className="mt-1 text-[19px] font-semibold tracking-[-0.03em] text-slate-900">
              Live Theme Chat
            </div>
            <div className="mt-1 text-[11px] leading-5 text-slate-500">
              Describe changes here. The Studio canvas updates live after each AI reply.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              className="gap-1 rounded-full"
              onClick={studioAI.clearConversation}
              disabled={studioAI.isRunning || !studioAI.messages.length}
            >
              <Trash2 size={12} />
              Clear
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="rounded-full"
              onClick={studioAI.close}
              disabled={studioAI.isRunning}
            >
              <X size={12} />
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Editing
          </div>
          <div className="mt-1 text-[13px] font-semibold text-slate-900">
            {studioAI.entityType === 'theme' ? 'Theme' : 'Site'}: {studioAI.title}
          </div>
          <div className="mt-1 text-[11px] leading-5 text-slate-500">
            {studioAI.currentPageSlug ? `Page: /${studioAI.currentPageSlug}` : 'Page: Home'}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {!studioAI.messages.length ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <MessageSquarePlus size={18} />
            </div>
            <div className="mt-4 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">
              Talk to the theme editor
            </div>
            <div className="mt-2 text-[12px] leading-6 text-slate-500">
              Ask for new sections, mobile fixes, content rewrites, spacing cleanup, block
              replacement, page cloning, or full visual refreshes. When the reply lands, the
              editor frame updates automatically.
            </div>

            <div className="mt-4 grid gap-2">
              {studioAI.starterPrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-left text-[12px] leading-5 text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
                  onClick={() => studioAI.setPrompt(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {studioAI.messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                warnings={message.warnings}
              />
            ))}

            {studioAI.isRunning ? (
              <div className="flex justify-start">
                <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-500 shadow-sm">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    AI
                  </div>
                  <div className="flex items-center gap-2">
                    <ReloadIcon className="animate-spin" />
                    Working on your theme changes...
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
          <TextareaAutosize
            minRows={5}
            maxRows={12}
            value={studioAI.prompt}
            onChange={(event) => studioAI.setPrompt(event.target.value)}
            placeholder="Tell the AI exactly what to change. Example: make the hero cleaner, reduce mobile spacing, replace the button section, and keep the black background."
            className="w-full resize-none border-0 bg-transparent px-1 py-1 text-[13px] leading-6 text-slate-900 outline-none"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void studioAI.runPrompt();
              }
            }}
            disabled={studioAI.disabled || studioAI.isRunning}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-[11px] leading-5 text-slate-500">
              Live apply is automatic. Review the canvas, then click the main{' '}
              <span className="font-semibold text-slate-800">Save</span> button.
            </div>
            <Button
              variant="primary"
              className="gap-2 rounded-full px-4"
              disabled={studioAI.disabled || studioAI.isRunning}
              onClick={() => {
                void studioAI.runPrompt();
              }}
            >
              {studioAI.isRunning ? (
                <ReloadIcon className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {studioAI.isRunning ? 'Working...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
