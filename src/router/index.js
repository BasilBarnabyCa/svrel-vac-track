import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/Login.vue";
import DashboardPage from "../views/Dashboard.vue";
import VaccinatedHorsesPage from "../views/VaccinatedHorses.vue";
import OverdueHorsesPage from "../views/OverdueHorses.vue";
import NeedsVaccinationPage from "../views/NeedsVaccination.vue";
import RequiresDoubleBoostersPage from "../views/RequiresDoubleBoosters.vue";
import MissingRoutineVaccinationPage from "../views/MissingRoutineVaccination.vue";
import Layout from "../components/Layout.vue";

const routes = [
  // Login route
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { guest: true }, // Only for unauthenticated users
  },

  // Authenticated routes under `/`
  {
    path: "/",
    component: Layout,
    meta: { requiresAuth: true }, // Requires login
    children: [
      { path: "", name: "Dashboard", component: DashboardPage },
      { path: "vaccinated", name: "Vaccinated Horses", component: VaccinatedHorsesPage },
      { path: "overdue", name: "Overdue Horses", component: OverdueHorsesPage },
      { path: "needs-vaccination", name: "Needs Vaccination", component: NeedsVaccinationPage },
	  { path: "requires-double-boosters", name: "Requires Double Boosters", component: RequiresDoubleBoostersPage },
	  { path: "missing-routine-vaccination", name: "Missing Route Vaccination", component: MissingRoutineVaccinationPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  // Redirect unauthenticated users to the login page
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // Redirect authenticated users away from the login page
  if (to.meta.guest && isAuthenticated) {
    return next("/");
  }

  next(); // Allow navigation to the intended route
});

export default router;