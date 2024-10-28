// stores/authentication/index.ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "../auth.store";
import type {
  LoginDto,
  PersonalDataDTO,
  UpdatePassword,
  UserData,
} from "../../services/authentication/types";
import { DefaultUser } from "../../services/authentication/types.ts";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/serviceHandler.ts";
import { ensureBase64Format } from "../../composables/useImage.ts";

export const useUserStore = defineStore("user", () => {
  const userData = ref<UserData>(DefaultUser);
  const personalData = ref<PersonalDataDTO | null>(null);
  const isLoading = ref(false);
  const authStore = useAuthStore();

  const currentUsername = computed(() => authStore.userName);

  function setUserData(data: UserData): void {
    userData.value = data;
  }

  function setPersonalData(data: PersonalDataDTO): void {
    if (data.avatar) {
      data.avatar = ensureBase64Format(data.avatar);
    }
    personalData.value = data;
  }

  async function dispatchLogin(
    credentials: LoginDto
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const res = await API.auth.login(credentials);
      if (res.status === 200) {
        setUserData(res.content);
        return { success: res.success, content: null };
      }
      throw new Error(`Unexpected status ${res.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  const changePassword = async (
    data: UpdatePassword
  ): Promise<APIResponse<string | null>> => {
    isLoading.value = true;
    try {
      const response = await API.auth.putUpdatePassword(data);
      if (response.status === 200) {
        return { success: response.success, content: null };
      }
      throw new Error(`${response.error} - ${response.content}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserProfile = async (): Promise<APIResponse<string | null>> => {
    isLoading.value = true;
    try {
      const response = await API.auth.getUserProfile(currentUsername.value);
      if (response.success) {
        setPersonalData(response.content);
        return { success: true, content: null };
      }
      throw new Error(response.error ?? "Error al obtener el perfil");
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserProfile = async (
    profile: PersonalDataDTO
  ): Promise<APIResponse<string | null>> => {
    isLoading.value = true;
    try {
      if (profile.avatar) {
        profile.avatar = profile.avatar.replace(
          /^data:image\/[a-z]+;base64,/,
          ""
        );
      }
      console.log("Antes de la API");
      const response = await API.auth.updateUserProfile(
        currentUsername.value,
        profile
      );
      console.log("Despues de la API");
      if (response.success) {
        setPersonalData(response.content);
        return { success: true, content: null };
      }
      throw new Error(response.error ?? "Error al obtener el perfil");
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    userData,
    personalData,
    isLoading,
    setPersonalData,
    dispatchLogin,
    changePassword,
    fetchUserProfile,
    updateUserProfile,
  };
});
