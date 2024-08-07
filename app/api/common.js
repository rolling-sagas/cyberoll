export const runtime = "edge";

export async function generate(messages, { cache, llm, filter }) {
  // console.log(chatCompletion.status);
  let data = null;

  // if (filter) {
  //   messages = messages.map((m) => {
  //     if (m.role === "user" || m.role === "assistant") {
  //       const obj = JSON.parse(m.content);
  //       if (obj.choices) {
  //         delete obj.choices;
  //       }
  //       if (obj.hidden) delete obj.hidden;
  //       return { role: m.role, content: JSON.stringify(obj) };
  //     }
  //     return m;
  //   });
  // }
  //
  // console.log("filter:", filter, messages);

  if (llm === "azure") {
    const chatCompletion = await generateWithAzureAPI(messages, cache);
    data = await chatCompletion.json();
  } else if (llm === "openai") {
    const chatCompletion = await generateWithOpenAIAPI(messages, cache);
    data = await chatCompletion.json();
  }

  // const chatCompletion = await generateWithOpenAIAPI(messages);
  if (data.error) {
    return { error: data.error };
  }

  return data.choices[0].message;
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
