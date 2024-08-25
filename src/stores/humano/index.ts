// stores/humano/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { MedicamentoDTO } from "../../services/humano/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/errorHandler.ts";

export const useHumanoStore = defineStore("humano", () => {
  const state = ref<MedicamentoDTO>();
  const expedientes = ref<MedicamentoDTO[]>([]);

  function initHumano(data: MedicamentoDTO): void {
    state.value = data;
  }

  function initExpedientes(data: MedicamentoDTO[]): void {
    expedientes.value = data;
  }

  async function dispatchGetExpediente(
    exp: string
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.humano.getExpediente(exp);
      if (status === 200) {
        initHumano(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  const dispatchGetExpedientes = async (
    desde: string,
    hasta: string
  ): Promise<APIResponse<string | null>> => {
    try {
      const { status, content } = await API.humano.getListaExpedientes(
        desde,
        hasta
      );
      if (status === 200) {
        initExpedientes(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  };

  const dispatchPostExpediente = async (
    medicamento: MedicamentoDTO
  ): Promise<APIResponse<string | null>> => {
    try {
      const { status, content, success } = await API.humano.postExpediente(
        medicamento
      );
      if (status === 200) {
        initHumano(content);
        return { success: success, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  };

  return {
    state,
    expedientes,
    dispatchGetExpediente,
    dispatchGetExpedientes,
    dispatchPostExpediente,
  };
});
