import Layout from "../components/layouts/Empty.vue";
import { Login } from "../views/login/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: false };

const route: RouteRecordRaw = {
  path: "/users",
  component: Layout,
  children: [
    { path: "", redirect: "login" },
    { path: "login", name: "login", meta, components: { empty: Login } },
  ],
};

export default route;
