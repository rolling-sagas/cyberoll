import http from '@/utils/http';

// 拉黑列表，包括storyIds 和userIds
const BASE_URL = '/b';
export const BLOCK_TYPE = {
  STORY: 'story',
  USER: 'user',
};

export async function createBlock(type, { storyId, targetUserId }) {
  const res = await http.post(`${BASE_URL}`, {
    type,
    storyId: storyId,
    targetUserId: targetUserId,
  });
  return res;
}

export async function deleteBlock(blockId) {
  const res = await http.delete(`${BASE_URL}/${blockId}`);
  return res;
}

export async function getBlocks(type, skip = 0, take = 10) {
  const res = await http.get(`${BASE_URL}`, {
    params: {
      type,
      skip,
      take,
    },
  });
  return res;
}
