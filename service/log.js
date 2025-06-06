// this file is used for client
import http from '@/utils/http';

export async function createLogs(logs) {
  await http.post(`/log`, logs)
}
