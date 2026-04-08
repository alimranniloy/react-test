import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const STUDIO_AI_SYSTEM_PROMPT = [
  "You are an expert BPONI Studio theme editor.",
  "BPONI Studio uses Reka JSON nodes and Tailwind CSS utility classes in className values.",
  "You receive a compact schema context and a user request.",
  "Return a JSON object with summary, warnings, and appHtml.",
  "appHtml must be the full HTML content for the inside of the App component.",
  "If the user asks for a whole website or page, return a complete multi-section page in appHtml.",
  "Use semantic HTML and Tailwind utility classes.",
  "Keep the HTML compact. Do not return nested JSON for the full page unless absolutely necessary.",
  "Never return a Program node by itself.",
  "Do not reference custom component names that are not already available in the schema context.",
  "Never set meta to null. Use an empty object instead.",
  "Preserve untouched schema structure and existing supported component types.",
  "Never remove the App component.",
  "Keep the result fully editable in BPONI Studio.",
  "Do not use scripts, style tags, or custom runtime code.",
  "Do not add explanations outside the JSON response.",
  "Keep the output valid for t.Schema.fromJSON().",
  "If the request is ambiguous, make the smallest high-quality change that still helps.",
].join(" ");

const readRequestBody = async (request: NodeJS.ReadableStream) => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  return Buffer.concat(chunks).toString("utf8");
};

const sendJson = (
  response: import("node:http").ServerResponse,
  statusCode: number,
  payload: unknown
) => {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
};

const STUDIO_AI_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    warnings: {
      type: "array",
      items: { type: "string" },
    },
    updatedSchema: {
      type: "object",
      additionalProperties: true,
    },
    appHtml: {
      type: "string",
    },
    updatedComponents: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
  required: ["summary", "warnings"],
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const buildStudioAiSchemaContext = (schema: unknown) => {
  const root = isRecord(schema) ? schema : {};
  const program = isRecord(root.program) ? root.program : {};
  const components = Array.isArray(program.components)
    ? program.components.filter(isRecord)
    : [];
  const appComponent =
    components.find((component) => component.name === "App") ?? components[0] ?? null;

  return {
    rootType: root.type ?? "State",
    rootId: root.id ?? null,
    programType: program.type ?? "Program",
    programId: program.id ?? null,
    componentNames: components
      .map((component) =>
        typeof component.name === "string" ? component.name : null
      )
      .filter(Boolean),
    appComponent,
  };
};

const extractGeminiText = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const candidates = Array.isArray((payload as { candidates?: unknown[] }).candidates)
    ? (payload as { candidates: Array<{ content?: { parts?: unknown[] } }> }).candidates
    : [];

  for (const candidate of candidates) {
    const parts = Array.isArray(candidate?.content?.parts)
      ? candidate.content.parts
      : [];

    for (const part of parts) {
      if (
        part &&
        typeof part === "object" &&
        typeof (part as { text?: unknown }).text === "string" &&
        (part as { text: string }).text.trim()
      ) {
        return (part as { text: string }).text;
      }
    }
  }

  return "";
};

const parseJsonObjectFromText = (value: string) => {
  const trimmed = value.trim();

  try {
    return JSON.parse(trimmed) as {
      summary?: string;
      warnings?: string[];
      updatedSchema?: unknown;
      appHtml?: string;
      updatedComponents?: unknown;
    };
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("The AI response was not valid JSON.");
    }

    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as {
      summary?: string;
      warnings?: string[];
      updatedSchema?: unknown;
      appHtml?: string;
      updatedComponents?: unknown;
    };
  }
};

const buildUpdatedSchemaFromAiPayload = (
  parsed: {
    updatedSchema?: unknown;
    updatedComponents?: unknown;
  },
) => {
  const updatedSchema = isRecord(parsed.updatedSchema) ? parsed.updatedSchema : null;
  const updatedComponents = Array.isArray(parsed.updatedComponents)
    ? parsed.updatedComponents.filter(isRecord)
    : [];

  if (updatedComponents.length) {
    const nextProgram = isRecord(updatedSchema?.program)
      ? { ...updatedSchema.program, components: updatedComponents }
      : { components: updatedComponents };

    return {
      ...(updatedSchema ?? {}),
      program: nextProgram,
    };
  }

  if (updatedSchema) {
    return updatedSchema;
  }

  return null;
};

const studioAiDevPlugin = ({
  apiKey,
  model,
}: {
  apiKey?: string;
  model: string;
}) => ({
  name: "studio-ai-dev-endpoint",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use("/api/studio-ai", async (request, response, next) => {
      if (request.method !== "POST") {
        next();
        return;
      }

      if (!apiKey) {
        sendJson(response, 500, {
          error:
            "GEMINI_API_KEY is not configured on the server. Set it in .env.local or your shell before running Vite.",
        });
        return;
      }

      try {
        const rawBody = await readRequestBody(request);
        const payload = JSON.parse(rawBody || "{}") as {
          prompt?: string;
          entityType?: "site" | "theme";
          title?: string | null;
          currentPageSlug?: string | null;
          schema?: unknown;
        };

        if (!payload.prompt?.trim()) {
          sendJson(response, 400, { error: "Prompt is required." });
          return;
        }

        if (!payload.schema || typeof payload.schema !== "object") {
          sendJson(response, 400, { error: "Current Studio schema is required." });
          return;
        }

        const geminiResponse = await fetch(
          `${GEMINI_API_BASE_URL}/${model}:generateContent`,
          {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: STUDIO_AI_SYSTEM_PROMPT }],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: JSON.stringify(
                      {
                        request: payload.prompt.trim(),
                        entityType: payload.entityType ?? "site",
                        title: payload.title ?? null,
                        currentPageSlug: payload.currentPageSlug ?? null,
                        schemaContext: buildStudioAiSchemaContext(payload.schema),
                      },
                      null,
                      2
                    ),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
              responseJsonSchema: STUDIO_AI_RESPONSE_SCHEMA,
              maxOutputTokens: 12000,
            },
          }),
        }
        );

        const geminiPayload = (await geminiResponse.json()) as {
          error?: {
            message?: string;
          };
        };

        if (!geminiResponse.ok) {
          sendJson(response, geminiResponse.status, {
            error:
              geminiPayload?.error?.message ||
              "Gemini request failed while generating Studio changes.",
          });
          return;
        }

        const responseText = extractGeminiText(geminiPayload);

        if (!responseText) {
          sendJson(response, 502, {
            error: "The AI response did not include any structured output.",
          });
          return;
        }

        const parsed = parseJsonObjectFromText(responseText);
        const nextSchema = buildUpdatedSchemaFromAiPayload(parsed);
        const appHtml =
          typeof parsed.appHtml === "string" && parsed.appHtml.trim()
            ? parsed.appHtml.trim()
            : null;

        if (!appHtml && (!nextSchema || typeof nextSchema !== "object")) {
          sendJson(response, 502, {
            error: "The AI response did not include a valid layout result.",
          });
          return;
        }

        sendJson(response, 200, {
          summary: parsed.summary ?? "Applied AI-generated changes.",
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
          updatedSchema: nextSchema,
          appHtml,
        });
      } catch (error) {
        sendJson(response, 500, {
          error:
            error instanceof Error
              ? error.message
              : "Unexpected Studio AI server error.",
        });
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const geminiModel =
    env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-2.0-flash";

  return {
    plugins: [
      react(),
      studioAiDevPlugin({
        apiKey: geminiApiKey,
        model: geminiModel,
      }),
    ],
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@headlessui/react",
        "@heroicons/react",
        "fuse.js",
        "@rekajs/react-code-editor",
        "@rekajs/parser"
      ]
    },
    // Some Reka packages reference `process.env` in browser builds.
    define: {
      "process.env": {}
    },
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@app": path.resolve(__dirname, "src/rekaStudio")
      }
    },
    server: {
      port: 5105,
      host: "0.0.0.0"
    }
  };
});
