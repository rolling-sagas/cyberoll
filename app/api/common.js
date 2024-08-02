export const runtime = "edge";

export async function generate(messages, cache = true) {
  // console.log(chatCompletion.status);
  // const chatCompletion = await generateWithOpenAIAPI(messages);
  const chatCompletion = await generateWithAzureAPI(messages, cache);
  const data = await chatCompletion.json();

  console.log(data);
  if (data.error) {
    return { error: data.error };
  }

  return data.choices[0].message;
}

async function generateWithOpenAIAPI(messages) {
  const url = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/rollingsagas/openai/chat/completions`;

  const chatCompletion = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
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
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  return chatCompletion;
}
