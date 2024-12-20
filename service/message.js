// this file is used for client
import http from '@/utils/http';

// 获取 story chapter 列表
export async function getMessages(chid) {
  const res = await http.get(`/m`, {
    params: {
      chid,
    }
  });
  return res;
}

export async function getMessage(chid) {
  const res = await http.get(`/m/${chid}`);
  return res;
}

export async function createMessage(chid, role, raw) {
  let content = raw
  if (typeof raw === 'string') {
    content = { data: [{ type: "md", value: raw }] }
  } else {
    content = { data: [raw] }
  }
  const msg = {
    chapterId: chid,
    role,
    content: role === "user" || role === "assistant" ? JSON.stringify(content) : raw
  }

  const res = await http.post(`/m`, msg);
  return res;
}

export async function updateMessage(mid, role, content) {
  const res = await http.post(`/m/${mid}`, {
    role,
    content,
  });
  return res;
}

export async function deleteMessage(mid, deleteBelow = false) {
  const res = await http.delete(`/m/${mid}`, {
    params: {
      below: deleteBelow ? 'true' : ''
    }
  });
  return res;
}

export async function copyMessage(data) {
  const res = await http.post(`/m/${data.id}/copy`, data);
  return res;
}

export async function setEntryMessage(mid) {
  const res = await http.post(`/m/${mid}/entry`);
  return res;
}
