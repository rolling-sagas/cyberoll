import axios from 'axios'
import Cookies from 'js-cookie';
import { goSso } from '.';
import toast from 'react-hot-toast/headless';
import { InformationCircleIcon } from '@hugeicons/react';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  timeout: 30000,
});

instance.interceptors.request.use(function (config) {
  config.headers['Session-Token'] = `${Cookies.get('session-token') || ''}`;
  return config;
});

instance.interceptors.response.use(response => response.data, err => {
  console.error('[axios error interceptor]', err, err.message, err.status)
  if (err.status === 401) {
    goSso()
  } else {
    const msg = err.response?.data?.msg
    if (typeof msg === 'string') {
      toast.error(msg, {
        duration: 3500,
        icon: (<InformationCircleIcon color='red' />),
        position: 'top-right'
      })
    }
  }
  throw err.response?.data?.msg || err.message || err;
});

export default instance
