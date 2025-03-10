// this file is used for client
import http from '@/utils/http';

export async function upsertStoryScript(storyId, script) {
  const res = await http.post(`/sc`, {
    storyId,
    value: script,
  });
}
