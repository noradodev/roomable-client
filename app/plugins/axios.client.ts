import axios from 'axios';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  });

  api.interceptors.request.use((req) => {
    const token = useCookie('auth_token').value;
    if (token) {
      req.headers = req.headers ?? {};
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  return {
    provide: {
      api
    }
  };
});
