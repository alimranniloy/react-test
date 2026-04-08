import * as React from 'react';

import { useToastStore } from '@/siteAdmin/store/useToastStore';

export type StudioAIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  warnings: string[];
  createdAt: number;
};

type StudioAIContextValue = {
  disabled: boolean;
  isOpen: boolean;
  isRunning: boolean;
  title: string;
  entityType: 'site' | 'theme';
  currentPageSlug: string | null;
  prompt: string;
  messages: StudioAIMessage[];
  starterPrompts: string[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  setPrompt: (value: string) => void;
  runPrompt: (explicitPrompt?: string) => Promise<void>;
  clearConversation: () => void;
};

type StudioAIProviderProps = {
  children: React.ReactNode;
  disabled?: boolean;
  entityType: 'site' | 'theme';
  title: string;
  currentPageSlug?: string | null;
  getCurrentSchema: () => unknown | null;
  onApplySchema: (schema: unknown) => void;
  buildSchemaFromHtml?: (html: string, currentSchema: unknown) => unknown;
};

type StudioAIResponse = {
  summary?: string;
  warnings?: string[];
  updatedSchema?: unknown;
  appHtml?: string;
  error?: string;
};

const STUDIO_AI_STARTER_PROMPTS = [
  'Create a bold hero section with a strong CTA and keep the black brand feel.',
  'Tighten the spacing and make this page look better on mobile screens.',
  'Replace the current section with a cleaner premium layout and stronger typography.',
  'Clone this content into a more modern landing page style with better hierarchy.',
];

const StudioAIContext = React.createContext<StudioAIContextValue | null>(null);

const createMessage = (
  role: StudioAIMessage['role'],
  content: string,
  warnings: string[] = []
): StudioAIMessage => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  role,
  content,
  warnings,
  createdAt: Date.now(),
});

export const StudioAIProvider = ({
  children,
  disabled = false,
  entityType,
  title,
  currentPageSlug,
  getCurrentSchema,
  onApplySchema,
  buildSchemaFromHtml,
}: StudioAIProviderProps) => {
  const addToast = useToastStore((state) => state.addToast);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [messages, setMessages] = React.useState<StudioAIMessage[]>([]);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    if (!isRunning) {
      setIsOpen(false);
    }
  }, [isRunning]);

  const toggle = React.useCallback(() => {
    setIsOpen((current) => {
      if (current && isRunning) {
        return current;
      }

      return !current;
    });
  }, [isRunning]);

  const clearConversation = React.useCallback(() => {
    setMessages([]);
  }, []);

  const runPrompt = React.useCallback(
    async (explicitPrompt?: string) => {
      const trimmedPrompt = (explicitPrompt ?? prompt).trim();

      if (!trimmedPrompt) {
        addToast({
          kind: 'error',
          title: 'Make with AI',
          subTitle: 'Write a prompt first.',
        });
        return;
      }

      const currentSchema = getCurrentSchema();

      if (!currentSchema) {
        addToast({
          kind: 'error',
          title: 'Make with AI',
          subTitle: 'Studio schema is not ready yet.',
        });
        return;
      }

      setIsOpen(true);
      setIsRunning(true);
      setPrompt('');
      setMessages((current) => [...current, createMessage('user', trimmedPrompt)]);

      try {
        const response = await fetch('/api/studio-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: trimmedPrompt,
            entityType,
            title,
            currentPageSlug: currentPageSlug ?? null,
            schema: currentSchema,
          }),
        });

        const payload = (await response.json()) as StudioAIResponse;

        if (!response.ok) {
          throw new Error(payload.error || 'AI request failed.');
        }

        const nextSchema =
          typeof payload.appHtml === 'string' && payload.appHtml.trim()
            ? buildSchemaFromHtml?.(payload.appHtml, currentSchema)
            : payload.updatedSchema;

        if (!nextSchema) {
          throw new Error('The AI response did not include an updated layout.');
        }

        onApplySchema(nextSchema);

        const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];
        const summary =
          payload.summary ?? 'Applied AI changes live to the Studio canvas.';

        setMessages((current) => [
          ...current,
          createMessage('assistant', summary, warnings),
        ]);

        addToast({
          kind: 'success',
          title: 'Make with AI',
          subTitle: 'Changes were applied to the canvas. Click Save to keep them.',
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not generate AI changes.';

        setMessages((current) => [...current, createMessage('error', message)]);
        addToast({
          kind: 'error',
          title: 'Make with AI',
          subTitle: message,
        });
      } finally {
        setIsRunning(false);
      }
    },
    [
      addToast,
      buildSchemaFromHtml,
      currentPageSlug,
      entityType,
      getCurrentSchema,
      onApplySchema,
      prompt,
      title,
    ]
  );

  const value = React.useMemo<StudioAIContextValue>(
    () => ({
      disabled,
      isOpen,
      isRunning,
      title,
      entityType,
      currentPageSlug: currentPageSlug ?? null,
      prompt,
      messages,
      starterPrompts: STUDIO_AI_STARTER_PROMPTS,
      open,
      close,
      toggle,
      setPrompt,
      runPrompt,
      clearConversation,
    }),
    [
      clearConversation,
      close,
      currentPageSlug,
      disabled,
      entityType,
      isOpen,
      isRunning,
      messages,
      open,
      prompt,
      runPrompt,
      title,
      toggle,
    ]
  );

  return (
    <StudioAIContext.Provider value={value}>{children}</StudioAIContext.Provider>
  );
};

export const useMaybeStudioAIContext = () => React.useContext(StudioAIContext);

export const useStudioAIContext = () => {
  const value = useMaybeStudioAIContext();

  if (!value) {
    throw new Error('Studio AI context not found');
  }

  return value;
};
