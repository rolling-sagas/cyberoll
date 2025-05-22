// 获取并处理 UTM 参数
export function getUtmParams() {
  const url = new URL(window.location.href);
  const utmParams = {};

  // 获取所有 UTM 参数
  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('utm_')) {
      utmParams[key] = value;
    }
  }

  return utmParams;
}

// 从 URL 中移除 UTM 参数
export function removeUtmParams() {
  const url = new URL(window.location.href);

  // 移除所有 UTM 参数
  for (const key of url.searchParams.keys()) {
    if (key.startsWith('utm_')) {
      url.searchParams.delete(key);
    }
  }

  // 更新 URL 但不刷新页面
  window.history.replaceState({}, '', url.toString());
}

// 将 UTM 参数存储到 localStorage
export function storeUtmParams(utmParams) {
  if (Object.keys(utmParams).length > 0) {
    localStorage.setItem('ad_source', JSON.stringify(utmParams));
  }
}

export function getUtmParamsFromLocalStorage() {
  const storedParams = localStorage.getItem('ad_source');
  if (storedParams) {
    return JSON.parse(storedParams);
  }
  return null;
}

// 从 localStorage 获取并删除 UTM 参数
export function getAndRemoveUtmParams() {
  const storedParams = localStorage.getItem('ad_source');
  if (storedParams) {
    localStorage.removeItem('ad_source');
    return JSON.parse(storedParams);
  }
  return null;
}
