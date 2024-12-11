// this file is used for client
import http from '@/utils/http';

// 获取 story chapter 列表
export async function getChapters(sid) {
  const res = await http.get(`/ch`, {
    params: {
      sid,
    }
  });
  return res;
}

export async function getChapter(chid) {
  const res = await http.get(`/ch/${chid}`);
  return res;
}

export async function createChapter(data) {
  const res = await http.post(`/ch`, data);
  return res;
}

export async function updateChapter(data) {
  const res = await http.post(`/ch/${data.id}`, data);
  return res;
}

export async function deleteChapter(chid) {
  const res = await http.delete(`/ch/${chid}`);
  return res;
}

export async function copyChapter(data) {
  const res = await http.post(`/ch/${data.id}/copy`, data);
  return res;
}
