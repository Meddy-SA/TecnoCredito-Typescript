// routers/credit.ts
import Layout from "../components/layouts/Default.vue";
import { Account } from "../views/credit/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: false };

const route: RouteRecordRaw = {
  path: "/credit",
  component: Layout,
  children: [{ path: "account", meta, component: Account }],
};

export default route;
