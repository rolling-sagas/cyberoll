// this file is used for client
import http from '@/utils/http';

// 获取 user info
export async function getUserInfo(uid = '_') {
  const res = await http.get(`/u/${uid}`);
  return res;
}
