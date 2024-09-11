export const runtime = "edge";

export async function generate(messages, { cache, llm }) {
  // console.log(chatCompletion.status);
  let res = null;

  // if (filter) {
  messages = messages.map((m) => {
    if (m.role === "user" || m.role === "assistant") {
      let obj = JSON.parse(m.content);
      obj.data = obj.data.filter((d) => d.type !== "pm");
      return { role: m.role, content: JSON.stringify(obj) };
    }
    return m;
  });

  try {
    if (llm === "azure") {
      res = await generateWithAzureAPI(messages, cache);
    } else if (llm === "openai") {
      res = await generateWithOpenAIAPI(messages, cache);
    }
    if (!res.ok) {
      return { error: { message: "Unknown fetch error" }, type: "llm-fetch" };
    }

    res = await res.json();
  } catch (e) {
    return { error: e, type: "llm-fetch" };
  }

  // const chatCompletion = await generateWithOpenAIAPI(messages);
  if (res.error) {
    return { error: res.error, type: "llm-response" }
  }

  return res.choices[0].message;
}

async function generateWithOpenAIAPI(messages, cache) {
  const url = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/rollingsagas/openai/chat/completions`;

  const chatCompletion = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "cf-skip-cache": `${!cache}`,
    },
    body: JSON.stringify({
      response_format: { type: "json_object" },
      model: "gpt-4o-mini",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  return chatCompletion;
}

async function generateWithAzureAPI(messages, cache) {
  const url = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/rollingsagas/azure-openai/dreameopenai04/gpt-4/chat/completions?api-version=2024-02-01`;

  const chatCompletion = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "api-key": `${process.env.AZURE_OPENAI_API_KEY}`,
      "cf-skip-cache": `${!cache}`,
    },
    body: JSON.stringify({
      response_format: { type: "json_object" },
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  return chatCompletion;
}

import { Prisma } from '@prisma/client'

export function isKnownError(e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    console.warn("prisma error:", e.code, e.message)
    return { message: "Database error", code: e.code }
  }

  if (e.type === "llm-fetch") {
    console.warn("llm fetch error:", e.error)
    return { message: "Llm fetch error", code: "LLM_FETCH" }
  }

  if (e.type === "llm-response") {
    console.warn("llm response error:", e.error)
    return { message: "Llm response error", code: "LLM_RESPONSE" }
  }

  if (e.type === "function-call") {
    console.warn("function call error:", e.error)
    return { message: e.message, code: "FUNCTION" }
  }

  if (e.type === "not-found") {
    return { message: e.message, code: "NOT_FOUND" }
  }

  if (e instanceof SyntaxError) {
    console.warn("json parsing error:", e.error)
    return { message: "JSON parsing error", code: "JSON_PARSING" }
  }

  console.error("unknown error:", e, e.type)
  return { message: "Unknown error", code: "UNKNOWN" }
}
