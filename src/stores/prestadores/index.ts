// stores/prestadores/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { PrestadorDTO } from "../../services/prestadores/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/errorHandler.ts";

export const usePrestadorStore = defineStore("prestador", () => {
  const state = ref<PrestadorDTO[]>([]);

  function init(data: PrestadorDTO[]): void {
    // Asignar a nombre la concatenación de apellido y nombre.
    const updatedData = data.map(prestador => ({
      ...prestador,
      nombre: `${prestador.apellido} ${prestador.nombre}` // Concatenamos apellido y nombre
    }));
    state.value = updatedData;
  }

  async function dispatchGetFarmacias(): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.prestador.getFarmacias();
      if (status === 200) {
        init(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    state,
    dispatchGetFarmacias,
  }
})
