// this file is used for client
import http from '@/utils/http';

export async function uploadImage(file) {
  const res = await http.post(
    '/up/img',
    file,
    {
      headers: {
        'x-file-name': encodeURIComponent(file.name),
      },
    }
  );
  return res;
}
