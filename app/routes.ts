import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("teams", "routes/teams/teams-dashboard.tsx"), // ✅ Route vers ton dashboard
] satisfies RouteConfig;
