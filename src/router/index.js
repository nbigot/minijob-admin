import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Jobs from "../views/Jobs.vue";
import CreateJob from "../views/CreateJob.vue";
import Resources from "../views/Resources.vue";
import Topics from "../views/Topics.vue";
import System from "../views/System.vue";
import Health from "../views/Health.vue";
import JobDetail from "../components/JobDetail.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/jobs",
    name: "Jobs",
    component: Jobs,
  },
  {
    path: "/job/create",
    name: "CreateJob",
    component: CreateJob,
  },
  {
    path: "/job/create/clone/:id",
    name: "CloneJob",
    component: CreateJob,
    props: (route) => ({ cloneJobId: route.params.id }),
  },
  {
    path: "/job/:id",
    name: "JobDetail",
    component: () => import("../components/JobDetail.vue"),
    props: (route) => ({ jobId: route.params.id }),
  },
  {
    path: "/resources",
    name: "Resources",
    component: Resources,
  },
  {
    path: "/topics",
    name: "Topics",
    component: Topics,
  },
  {
    path: "/system",
    name: "System",
    component: System,
  },
  {
    path: "/health",
    name: "Health",
    component: Health,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
