// this file is used for client
import http from '@/utils/http';

export async function getComments(sid, page = 0) {

  const res = await http.get(`/comment`, {
    params: {
      sid,
      take: 30,
      skip: page * 30,
    }
  });
  return res;
}

export async function getComment(coid) {
  const res = await http.get(`/comment/${coid}`);
  return res;
}

export async function createComment(data) {
  const res = await http.post(`/comment`, data);
  return res;
}

export async function updateComment(coid, data) {
  const res = await http.post(`/comment/${coid}`, data);
  return res;
}

export async function deleteComment(coid) {
  const res = await http.delete(`/comment/${coid}`);
  return res;
}
