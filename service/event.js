import serverHttp from '@/utils/server-http';

export async function createServerEvent(events) {
  return await serverHttp.post(`/e`, events);
}
