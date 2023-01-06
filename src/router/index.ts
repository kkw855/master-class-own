import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import PageHome from "@/views/PageHome.vue";
import PageThreadShow from "@/views/PageThreadShow.vue";

const routes: readonly RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: PageHome,
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: PageThreadShow,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
