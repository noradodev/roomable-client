import type { PaginationMeta } from "~/types/shared";
import type {
  CreateTenantInput,
  Tenant,
  UpdateTenantInput,
} from "~/types/tenant";
export interface StructuredData {
  p: Tenant[];
  pagination: PaginationMeta;
}

export interface ApiResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: StructuredData;
}

export const useTenantStore = defineStore("tenant", () => {
  const api = useApi();
  const tenants = ref<Tenant[]>([]);
  const tenant = ref<Tenant | null>(null);
  const pagination = ref<PaginationMeta | null>(null);
  const loading = ref(false);
  const tgLoading = ref(false);
  const error = ref<string | null>(null);
  const currentTenant = ref<Tenant | null>(null);
   const telegramSession = ref({
      link: "",
    });

  const allTenants = computed(() => tenants.value);
  const hasNextPage = computed(() => pagination.value?.links.next !== null);
  const nextPageUrl = computed(() => pagination.value?.links.next);

  async function fetchTenants(filter = {}) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get("/tenants");

      tenants.value = response.data.p;
      pagination.value = response.data.pagination;
    } catch (e: any) {
      error.value = e.message || "An unexpected error occurred during fetch.";
      console.error("Fetch Error:", e);
    } finally {
      loading.value = false;
    }
  }
    async function connectTelegram(id: string) {
    tgLoading.value = true;

    try {
      const res = await api.post(`/telegram/tenant/connect/${id}`);
      if (res.success) {
        telegramSession.value = {
            link: res.data.link,
        };
        
      }
      return res;
    } catch (error: any) {
      console.log(error);
      throw error;
    } finally {
      tgLoading.value = false;
    }
  }
  const fetchTenant = async (tenantId: string) => {
    loading.value = true;
    try {
      const res = await api.get(`/tenants/${tenantId}`);
      tenant.value = res.data;
      console.log(tenant.value);
      return res.data.data;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createTenant = async (tenantData: CreateTenantInput) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await api.post("/tenants", tenantData);
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to create tenant";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTenant = async (id: string, tenantData: UpdateTenantInput) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await api.put<Tenant>(`/tenants/${id}`, tenantData);

      const index = tenants.value.findIndex((tenant) => tenant.id === id);
      if (index !== -1) {
        tenants.value[index] = data;
      }

      if (currentTenant.value?.id === id) {
        currentTenant.value = data;
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to update tenant";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTenant = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/tenants/${id}`);
      tenants.value = tenants.value.filter((tenant) => tenant.id !== id);

      if (currentTenant.value?.id === id) {
        currentTenant.value = null;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to delete tenant";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    tenants,
    tenant,
    pagination,
    loading,
    error,
    tgLoading,

    // Getters
    allTenants,
    hasNextPage,
    nextPageUrl,

    fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    fetchTenant,
    connectTelegram,
  };
});
