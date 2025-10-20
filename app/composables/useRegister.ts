import type { Ref } from 'vue';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  user: Record<string, any>;
  token: string;
}

interface UseRegisterReturn {
  register: (
    form: RegisterForm
  ) => Promise<{
    data: Ref<RegisterResponse | undefined>;
    error: Ref<any>;
  }>;
}

export const useRegister = (): UseRegisterReturn => {
  const $auth = useAuth(); 

  const register = async (form: RegisterForm) => {
    const { data, error } = await useFetch<RegisterResponse>('/register', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.apiBase,
      body: form,
    });

    if (data.value?.user && data.value?.token) {
      await $auth.signIn({
        token: data.value.token,
        tokenType: 'Bearer',
      });
    }

    return { data, error };
  };

  return { register };
};