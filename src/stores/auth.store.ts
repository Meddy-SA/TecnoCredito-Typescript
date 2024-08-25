import { defineStore } from "pinia";
import { default as router } from "../routers/index.ts";
import { useUserStore } from "./authentication/index.ts";
import { useAlertStore } from "./index.ts";
import type { MenuItem } from "../types/types.primevue.ts";
import type { UserData, LoginDto } from "../services/authentication/types.ts";
import PngUser from "@/assets/imgs/user.png";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userName: localStorage.getItem("userName") as string | "",
    name: localStorage.getItem("name") ?? "",
    email: localStorage.getItem("email") ?? "",
    token: localStorage.getItem("token") ?? "",
    menu: localStorage.getItem("menu") ?? "",
    avatar: localStorage.getItem("avatar") ?? PngUser,
  }),
  getters: {
    getMenu: (state): MenuItem[] => {
      try {
        return state.menu ? JSON.parse(state.menu) : [];
      } catch (error) {
        console.error("Error parsing menu:", error);
        return [];
      }
    },
  },
  actions: {
    async login(credentials: LoginDto): Promise<boolean> {
      const t = this;
      const userStore = useUserStore();
      const alertStore = useAlertStore();

      try {
        const response = await userStore.dispatchLogin(credentials);
        console.log("Login response:", response);
        if (response.success) {
          t.updateUserInfo(userStore.state);
          router.push("/home");
        } else {
          alertStore.toastAlert(
            response.content ?? "Error al iniciar sesión",
            "error",
            10,
            "Verfique un usuario y contraseña"
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
    },

    logout() {
      this.clearUserInfo();
      router.push("/users/login");
    },

    updateUserInfo(userInfo: UserData) {
      this.userName = userInfo.userName;
      this.email = userInfo.email;
      this.name = `${userInfo.name} ${userInfo.lastName}`;
      this.token = userInfo.token ?? "";
      this.menu = userInfo.menu ?? "";
      this.avatar = userInfo.avatar ?? PngUser;
      this.cacheUserInfo();
    },

    cacheUserInfo() {
      localStorage.setItem("userName", this.userName);
      localStorage.setItem("name", this.name);
      localStorage.setItem("email", this.email);
      localStorage.setItem("token", this.token);
      localStorage.setItem("menu", this.menu);
      localStorage.setItem("avatar", this.avatar);
    },

    clearUserInfo() {
      this.userName = "";
      this.name = "";
      this.email = "";
      this.token = "";
      this.menu = "";
      this.avatar = PngUser;

      localStorage.removeItem("userName");
      localStorage.removeItem("displayName");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("menu");
      localStorage.removeItem("avatar");
    },
  },
});
