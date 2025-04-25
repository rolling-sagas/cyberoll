import http from '@/utils/http';

const getReportSchema = (data) => {
  return {
    content: data?.content || '',
    userId: data?.userId || '',
    targetUserId: data?.targetUserId || '',
    images: data?.images || '',
    commentId: data?.commentId || '',
    storyId: data?.storyId || '',
    type: data?.type || 'app',
    // status: data?.status || 'pending',
  };
};

export async function feedback(data) {
  const res = await http.post(`/fb`, getReportSchema(data));
  return res;
}
