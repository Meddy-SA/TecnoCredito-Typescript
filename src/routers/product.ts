import Layout from "../components/layouts/Default.vue";
import { Create } from "../views/products/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: false };

const route: RouteRecordRaw = {
  path: "/products",
  component: Layout,
  children: [{ path: "create", meta, component: Create }],
};

export default route;
