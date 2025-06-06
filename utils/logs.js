import Storage from './storage';
import { createLogs } from '@/service/log';
const LOG_STORAGE_KEY = 'RS_LOGS';
let restoreCount = 0;

// https://dreametech.feishu.cn/wiki/OEL4wBqxjij2Sxk2pZTcvJ3unng
function add(options = {}) {
  if (typeof window === 'undefined') return;
  const logs = Storage.get(LOG_STORAGE_KEY, []);
  const { host, href: url, pathname: path } = location;
  logs.push({
    host,
    url,
    path,
    ua: navigator.userAgent,
    type: 'log',
    ...options,
  });
  Storage.set(LOG_STORAGE_KEY, logs);
  console.log('[logs add]:', options);
}

export function info(options = {}) {
  options.level = 'info';
  add(options);
}

export function warn(options = {}) {
  options.level = 'warn';
  add(options);
}

export function error(options = {}) {
  options.level = 'error';
  add(options);
}

export function log(options = {}) {
  options.level = 'log';
  add(options);
}

function reStore(logs = []) {
  if (restoreCount > 5) return;
  restoreCount ++;
  const curLogs = Storage.get(LOG_STORAGE_KEY, []);
  Storage.set(LOG_STORAGE_KEY, [...logs, ...curLogs]);
}

export async function save(options = {}) {
  const logs = Storage.get(LOG_STORAGE_KEY, []);
  Storage.del(LOG_STORAGE_KEY);
  if (logs.length) {
    try {
      await createLogs(logs);
      restoreCount = 0;
    } catch (e) {
      console.log(e);
      reStore(logs);
    }
  }
}

export default {
  log,
  info,
  warn,
  error,
  save,
};
