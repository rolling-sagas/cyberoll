import axios from 'axios'
import Cookies from 'js-cookie';
import { goSso } from '.';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  timeout: 30000,
});

instance.interceptors.request.use(function (config) {
  config.headers['Session-Token'] = `${Cookies.get('session-token') || ''}`;
  return config;
});

instance.interceptors.response.use(response => response.data, err => {
  console.error(err, err.message, err.status)
  if (err.status === 401) {
    goSso()
  }
  throw err;
});

export default instance
