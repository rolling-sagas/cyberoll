import http from '@/utils/http';

export const FEEDBACK_TYPE = {
  APP: 'app',
  USER: 'user',
  STORY: 'story',
  COMMENT: 'comment',
};

const getReportSchema = (data) => {
  const schema = {
    // content: data?.content || '',
    userId: data?.userId || '',
    // targetUserId: data?.targetUserId || '',
    // images: data?.images || '',
    // commentId: data?.commentId || '',
    // storyId: data?.storyId || '',
    type: data?.type || FEEDBACK_TYPE.APP,
  };
  // 注释掉的，如果 data 有值，则加到schema中
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== '') {
      schema[key] = data[key];
    }
  });
  return schema;
};

export async function feedback(data) {
  const res = await http.post(`/fb`, getReportSchema(data));
  return res;
}
