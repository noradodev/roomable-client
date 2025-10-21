interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();
  const baseURL = config.public.apiBase || "/api";

  const apiFetch = async <T>(url: string, options: any = {}) => {
    const headers = {
      ...(token && { Authorization: `${token.value}` }),
      ...options.headers,
    };
    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] = "application/json";
    }
    return await $fetch<T>(url, {
      baseURL,
      ...options,
      headers,
    });
  };
  const get = <T = any>(url: string, params?: Record<string, any>) =>
    apiFetch<T>(url, { method: "GET", params });

  const post = <T = any>(url: string, body?: any) =>
    apiFetch<T>(url, { method: "POST", body });

  const put = <T = any>(url: string, body?: any) =>
    apiFetch<T>(url, { method: "PUT", body });

  const patch = <T = any>(url: string, body?: any) =>
    apiFetch<T>(url, { method: "PATCH", body });

  const del = <T = any>(url: string) => apiFetch<T>(url, { method: "DELETE" });

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
