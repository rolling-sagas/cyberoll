// this file is used for client
import http from '@/utils/http';

// 获取 story 列表
export async function getStories() {
  const res = await http.get('/s');
  return res;
}

export async function getPublicStories() {
  const res = await http.get('/s/_/public');
  return res;
}

export async function getStory(sid) {
  const res = await http.get(`/s/${sid}`);
  return res;
}

export async function createStory(data) {
  const res = await http.post('/s', data);
  return res;
}

export async function updateStory(sid, data) {
  const res = await http.post(`/s/${sid}`, data);
  return res;
}

export async function deleteStory(sid) {
  const res = await http.delete(`/s/${sid}`);
  return res;
}

export async function likeStory(sid) {
  const res = await http.post(`/s/${sid}/like`);
  return res;
}

export async function dislikeStory(sid) {
  const res = await http.delete(`/s/${sid}/like`);
  return res;
}

export async function copyStory(data) {
  const res = await http.post(`/s/${data.id}/copy`, data);
  return res;
}
