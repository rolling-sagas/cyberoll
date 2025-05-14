// this file is used for client
import http from '@/utils/http';

export async function search(q, take = 10, skip = 0) {
  const res = await http.get(`/s/_/public`, {
    params: {
      q,
      take,
      skip,
    },
  });
  return res;
}
