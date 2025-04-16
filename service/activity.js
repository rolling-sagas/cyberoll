import http from '@/utils/http';

const BASE_URL = '/a';

// 获取 activity 列表
export async function getActivities(type = '', page = 0, size = 10) {
  const res = await http.get(BASE_URL, {
    params: {
      take: size,
      skip: page * size,
      type,
    },
  });
  return res;
}

// 获取 activity 是否有更新
export async function checkActivityUpdateStatus() {
  const res = await http.get(`${BASE_URL}/_/check`, {});
  return res;
}
