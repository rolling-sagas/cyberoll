function get(name, def) {
  if (typeof localStorage === 'undefined') return null;
  const val = localStorage.getItem(name);
  if (val === null) {
    return def
  } else {
    return JSON.parse(val);
  }
}

function set(name, val) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(name, JSON.stringify(val));
}

function del(name) {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(name)
}

export default {
  set,
  get,
  del,
}
