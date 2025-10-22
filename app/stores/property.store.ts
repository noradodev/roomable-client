import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Floor, Property, Room } from "@/types/property";

export const usePropertyStore = defineStore("property", () => {
  const api = useApi();
  const properties = ref<Property[]>([]);
  const property = ref<Property | null>(null);
  const room = reactive<Room>({
    id: "",
    room_number: "",
    room_type: "",
    price: 0,
    status: 'available' as 'available' | 'occupied' | 'maintenance',
   current_tenant_id: null,
  });
  const tenantList = ref([]);
  const loading = ref(false);

  const allProperties = computed(() => properties.value);
  const viewProperty = computed(() => property.value);
  const fetchProperties = async () => {
    loading.value = true;
    try {
      const response = await api.get("/properties");
      properties.value = response.data.properties;
      return response;
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const fetchProperty = async (uuid: string) => {
    loading.value = true;
    try {
      const response = await api.get(`/properties/${uuid}`);
      property.value = response.data.property;
      return response;
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const createProperty = async (payload: any) => {
    loading.value = true;

    try {
      const response = await api.post(`/properties`, payload);
      return response;
    } catch (error: any) {
    } finally {
      loading.value = false;
    }
  };
  const deleteProperty = async (uuid: string) => {
    loading.value = true;
    try {
      const response = await api.delete(`/properties/${uuid}`);
      return response;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const updateProperty = async (uuid: string, formData: FormData) => {
    loading.value = true;
    try {
      const res = await api.post(`/properties/${uuid}`, formData);
      return res;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateRoom = async (uuid: string, payload: Room) => {
    loading.value = true;
    try {
      const res = await api.put(`/rooms/${uuid}`, payload);
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const fetchRoom = async (uuid: string) => {
    try {
      const res = await api.get(`/rooms/${uuid}`);
      const roomData = res.data.data || res.data;
      room.id = roomData.id;
      room.room_number = roomData.room_number;
      room.room_type = roomData.room_type;
      room.price = Number(roomData.price);
      room.status = roomData.status;
      room.current_tenant_id = roomData.current_tenant_id ?? null;
      return res;
    } catch (err: any) {
      throw err;
    }
  };
  const fetchTenantList = async () => {
    loading.value = true;
    try {
      const res = await api.get("/t-list");
      tenantList.value = res.data;
      console.log(tenantList.value);
      return res;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    allProperties,
    properties,
    viewProperty,
    loading,
    room,
    tenantList,
    fetchProperties,
    fetchProperty,
    deleteProperty,
    createProperty,
    fetchRoom,
    updateProperty,
    fetchTenantList,
    updateRoom
  };
});
