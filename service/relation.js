// this file is used for client
import http from '@/utils/http';

// get user followers
export async function getFollowers(page = 0, size = 10, uid = '_') {
  const res = await http.get(`/r/fe`, {
    params: {
      uid,
      take: size,
      skip: page * size,
    }
  });
  return res;
}

export async function getFollowings(page = 0, size = 10, uid = '_') {
  const res = await http.get(`/r/f`, {
    params: {
      uid,
      take: size,
      skip: page * size,
    }
  });
  return res;
}

export async function toggleFollowUser(uid, isFollow) {
  if (isFollow) {
    await http.post(`/r/f/${uid}`);
  } else {
    await http.delete(`/r/f/${uid}`);
  }
}
