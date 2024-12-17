// this file is used for client
import http from '@/utils/http';

export async function getComponents(chid) {
  const res = await http.get(`/co`, {
    params: {
      chid,
    }
  });
  return res;
}

export async function getComponent(coid) {
  const res = await http.get(`/co/${coid}`);
  return res;
}

export async function createComponent(coid, role, raw) {
  const content = { data: [{ type: "md", value: raw }] }
  const msg = {
    chapterId: coid,
    role,
    content: role === "user" || role === "assistant" ? JSON.stringify(content) : raw
  }

  const res = await http.post(`/co`, msg);
  return res;
}

export async function createImageComponent(coid, role, raw) {
  const content = { data: [{ type: "md", value: raw }] }
  const msg = {
    chapterId: coid,
    role,
    content: role === "user" || role === "assistant" ? JSON.stringify(content) : raw
  }

  const res = await http.post(`/co`, msg);
  return res;
}

export async function updateComponent(mid, role, content) {
  const res = await http.post(`/co/${mid}`, {
    role,
    content,
  });
  return res;
}

export async function updateImageComponent(mid, role, content) {
  const res = await http.post(`/co/${mid}`, {
    role,
    content,
  });
  return res;
}

export async function deleteComponent(mid, deleteBelow = false) {
  const res = await http.delete(`/co/${mid}`, {
    params: {
      below: deleteBelow ? 'true' : ''
    }
  });
  return res;
}

export async function copyComponent(data) {
  const res = await http.post(`/co/${data.id}/copy`, data);
  return res;
}

export async function setEntryComponent(mid) {
  const res = await http.post(`/co/${mid}/entry`);
  return res;
}
