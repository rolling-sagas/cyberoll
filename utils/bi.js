const url = 'https://luoyeshu-search-4535246559.us-east-1.bonsaisearch.net';
const username = 'wut79l9j41';
const password = 'pmkplvlsn';
const encodedCredentials = btoa(`${username}:${password}`);

async function bi(level, data) {
  const index = `requests_nextjs_${level}`
  try {
    await fetch(`${url}/${index}/_doc`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        time: + new Date(),
      })
    })
  } catch(e) {
    console.error('[bi failed]', e)
  }
}

async function error(data) {
  await bi('error', data)
}

async function info(data) {
  await bi('error', data)
}

async function log(data) {
  await bi('error', data)
}

export default {
  error,
  log,
  info,
}
