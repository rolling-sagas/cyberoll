// this file is used for client
import http from '@/utils/http';

// test api
export async function testApi() {
  const res = await http.get('/test');
  return res;
}
