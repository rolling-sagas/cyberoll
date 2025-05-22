import { InformationCircleIcon } from '@hugeicons/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast/headless';
import { goSso } from '.';
import { showAppealDialog } from './appeal-dialog';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  timeout: 30000,
});

instance.interceptors.request.use(function (config) {
  config.headers['Session-Token'] = `${Cookies.get('session-token') || ''}`;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    try {
      const data = response.data;
      return data;
    } catch (error) {
      return response;
    }
  },
  (err) => {
    console.error('[axios error interceptor]', err, err.message, err.status);
    if (err.status === 401) {
      goSso();
    } else if (err.status === 403) {
      const msg = err.response?.data?.msg;
      showAppealDialog(msg || '403 Forbidden', { content: 'text-center' });
    } else {
      const msg = err.response?.data?.msg;
      if (typeof msg === 'string') {
        toast.error(msg, {
          duration: 3500,
          icon: <InformationCircleIcon color="red" />,
          position: 'top-right',
        });
      }
    }
    throw err.response?.data?.msg || err.message || err;
  }
);

export default instance;
