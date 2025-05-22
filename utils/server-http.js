import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  timeout: 30000,
});

instance.interceptors.request.use(function (config) {
  // 服务端请求不需要处理 cookie
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
    console.error('[server axios error]', err.message);
    throw err.response?.data?.msg || err.message || err;
  }
);

export default instance;
