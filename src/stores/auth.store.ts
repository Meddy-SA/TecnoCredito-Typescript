import { defineStore, storeToRefs } from "pinia";
import { default as router } from "../routers/index.ts";
import { useUserStore } from "./authentication/index.ts";
import { useAlertStore } from "./index.ts";
import type { MenuItem } from "../types/types.primevue.ts";
import type { UserData, LoginDto } from "../services/authentication/types.ts";
import PngUser from "@/assets/imgs/user.png";
import { useStorage } from "@vueuse/core";
import { computed } from "vue";
import { ensureBase64Format } from "../composables/useImage.ts";

export const useAuthStore = defineStore("auth", () => {
  const userName = useStorage("userName", "");
  const name = useStorage("name", "");
  const email = useStorage("email", "");
  const token = useStorage("token", "");
  const menu = useStorage("menu", "");
  const avatar = useStorage("avatar", PngUser);

  const getMenu = computed<MenuItem[]>((): [] => {
    try {
      return menu.value ? JSON.parse(menu.value) : [];
    } catch (error) {
      console.error("Error parsing menu:", error);
      return [];
    }
  });

  async function login(credentials: LoginDto): Promise<boolean> {
    const userStore = useUserStore();
    const alertStore = useAlertStore();
    const { userData } = storeToRefs(userStore);

    try {
      const response = await userStore.dispatchLogin(credentials);
      if (response.success) {
        updateUserInfo(userData.value);
        router.push("/home");
      } else {
        alertStore.toastAlert(
          response.content ?? "Error al iniciar sesión",
          "error",
          10,
          "Verfique un usuario y contraseña"
        );
      }
      return response.success;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error de solicitud:", error);
      } else {
        console.error("Error al autenticarse:", error);
      }
    }
    return false;
  }

  function logout() {
    clearUserInfo();
    router.push("/users/login");
  }

  function updateUserInfo(userInfo: UserData) {
    userName.value = userInfo.userName;
    email.value = userInfo.email;
    name.value = `${userInfo.name} ${userInfo.lastName}`;
    token.value = userInfo.token ?? "";
    menu.value = userInfo.menu ?? "";
    avatar.value = userInfo.avatar
      ? ensureBase64Format(userInfo.avatar)
      : PngUser;
  }

  function updateAvatar(base64: string) {
    avatar.value = base64;
  }

  function clearUserInfo() {
    userName.value = null;
    name.value = null;
    email.value = null;
    token.value = null;
    menu.value = null;
    avatar.value = null;
  }

  return {
    userName,
    name,
    email,
    token,
    menu,
    avatar,
    getMenu,
    login,
    logout,
    updateUserInfo,
    updateAvatar,
    clearUserInfo,
  };
});
