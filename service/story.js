// this file is used for client
import http from '@/utils/http';

// 获取 story 列表
export async function getStories(page = 0, size = 10) {
  const res = await http.get('/s', {
    params: {
      take: size,
      skip: page * size,
    }
  });
  return res;
}

export async function getPublicStories(page = 0, size = 10, authorId) {
  const res = await http.get('/s/_/public', {
    params: {
      take: size,
      skip: page * size,
      authorId,
    }
  });
  return res;
}

export async function getLikedStories(page = 0, size = 10, likedBy) {
  const res = await http.get('/s/_/like', {
    params: {
      take: size,
      skip: page * size,
      likedBy,
    }
  });
  return res;
}

export async function getStory(sid, params = {}) {
  const res = await http.get(`/s/${sid}`, { params });
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
