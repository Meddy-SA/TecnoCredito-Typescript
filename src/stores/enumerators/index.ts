// stores/enumerators/index.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { APIResponse } from "../../services/types.ts";
import { API } from "../../services/index.ts";
import { handleApiError } from "../../services/serviceHandler.ts";
import type { EnumDTO } from "../../services/enumerator/types.ts";

export const useEnumeratorStore = defineStore("enumerator", () => {
  const sexo = ref<EnumDTO[]>([]);
  const status = ref<EnumDTO[]>([]);
  const roles = ref<EnumDTO[]>([]);
  const isLoading = ref(false);

  function setSexs(data: EnumDTO[]): void {
    sexo.value = data;
  }

  function setStatuses(data: EnumDTO[]): void {
    status.value = data;
  }

  function setRoles(data: EnumDTO[]): void {
    roles.value = data;
  }

  async function fetchSexos(): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.status.getSexos();
      if (result.success) {
        setSexs(result.content);
        return { success: true, content: null };
      }

      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchStatuses(): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.status.getStatus();
      if (result.success) {
        setStatuses(result.content);
        return { success: true, content: null };
      }
      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchRoles(): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.status.getRoles();
      if (result.success) {
        setRoles(result.content);
        return { success: true, content: null };
      }
      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    sexo,
    status,
    roles,
    isLoading,
    fetchSexos,
    fetchStatuses,
    fetchRoles,
  };
});
