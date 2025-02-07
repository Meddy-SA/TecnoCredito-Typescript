import Layout from "../components/layouts/Default.vue";
import { Create } from "../views/payments/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: false };

const route: RouteRecordRaw = {
  path: "/payments",
  component: Layout,
  children: [{ path: "index", meta, component: Create }],
};

export default route;
