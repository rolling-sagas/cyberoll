import bi from '@/utils/bi'

export default async function ifetch(url, options) {
  try {
    const res = await fetch(url, options)
    if (res.ok) {
      return res
    } else {
      await bi.error({
        status: res.status,
        error: res.statusText,
        url,
        options,
      })
      throw res.statusText
    }
  } catch (e) {
    await bi.error({
      error: e.message || e.toString() || 'fetch error',
      url,
      options,
    })
    throw e
  }
}