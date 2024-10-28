import Layout from "../components/layouts/Default.vue";
import { List as ProductList } from "../views/products/index.ts";
import { List as CategoryList } from "../views/category/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: false };

const route: RouteRecordRaw = {
  path: "/products",
  component: Layout,
  children: [
    { path: "index", meta, component: ProductList },
    { path: "category", meta, component: CategoryList },
  ],
};

export default route;
