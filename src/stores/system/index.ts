// stores/system/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { FechaDTO, MesesDTO } from "../../services/system/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/errorHandler.ts";

export const useSystemStore = defineStore("system", () => {
  const state = ref<Date>();
  const meses = ref<MesesDTO>();

  function initSystem(data: FechaDTO): void {
    state.value = new Date(data.fecha);
  }

  function initMeses(data: MesesDTO): void {
    meses.value = data;
  }

  async function dispatchGetFecha(): Promise<APIResponse<string | null>> {
    try {
      const { status, content, success } = await API.system.getFecha();
      if (status === 200) {
        initSystem(content);
        return { success: success, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  const dispatchGetMesActual = async (): Promise<
    APIResponse<string | null>
  > => {
    try {
      const { status, content, success } = await API.system.getMesActual();
      if (status === 200) {
        initMeses(content);
        return { success: success, content: null };
      }

      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  };

  return {
    state,
    meses,
    dispatchGetFecha,
    dispatchGetMesActual,
  };
});
