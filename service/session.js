// this file is used for client
import http from '@/utils/http';
import { parseJson } from '@/utils/utils';

// 获取 story 列表
export async function getSessions() {
  const res = await http.get('/se');
  return res;
}

export async function getSession(seid) {
  const res = await http.get(`/se/${seid}`);
  if (res.messages)
    res.messages.forEach((m) => {
      m.content = parseJson(m.content);
      m.state = parseJson(m.state);
    });
  return res;
}

export async function createSession(sid) {
  const res = await http.post('/se', {
    sid,
  });
  return res;
}

export async function updateSession(seid, data) {
  const res = await http.post(`/se/${seid}`, data);
  return res;
}

export async function deleteSession(seid) {
  const res = await http.delete(`/se/${seid}`);
  return res;
}

export async function resetSession(seid, mid, exclude = false) {
  const res = await http.post(`/se/${seid}/reset`, {
    mid,
    exclude,
  });
  return res;
}
