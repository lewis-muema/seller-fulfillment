import { createRouter, createWebHistory } from "vue-router";
import Canvas from "../components/canvas.vue";

const routes = [
  {
    path: "/",
    name: "canvas",
    component: Canvas,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
