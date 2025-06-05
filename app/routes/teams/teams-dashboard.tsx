import { TeamsDashboard } from "~/Pages/TeamsDashboard/TeamsDashboard";
import { TeamsProvider } from "~/Contexts/Teams/TeamsContext";

export default function TeamsDashboardRoute() {
  return (
    <TeamsProvider>
      <TeamsDashboard />
    </TeamsProvider>
  );
}