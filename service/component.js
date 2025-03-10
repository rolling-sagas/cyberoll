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

export async function createComponent(data) {
  const res = await http.post(`/co`, data);
  return res;
}

export async function updateComponent(coid, data) {
  const res = await http.post(`/co/${coid}`, data);
  return res;
}

export async function deleteComponent(coid) {
  const res = await http.delete(`/co/${coid}`);
  return res;
}

export async function resetComponents(sid = undefined, chid = undefined) {
  const res = await http.post(`/co/_/reset`, {
    sid,
      chid,
  });
  return res;
}

export async function copyComponent(data) {
  const res = await http.post(`/co/${data.id}/copy`, data);
  return res;
}

export async function setEntryComponent(coid) {
  const res = await http.post(`/co/${coid}/entry`);
  return res;
}

export async function updateComponentsWithName(chid, updates) {
  const res = await http.post(`/co/_/update`, {
    chid,
    updates,
  });
}
