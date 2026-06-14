import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomePage from "@/pages/welcome";
import MapPage from "@/pages/map";
import ChapterPage from "@/pages/chapter";
import AdminPage from "@/pages/admin";
import MusicPlayer from "@/components/MusicPlayer";
import SettingsSidebar from "@/components/SettingsSidebar";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/map" component={MapPage} />
      <Route path="/chapter/:id" component={ChapterPage} />
      <Route path="/admin" component={AdminPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <MusicPlayer />
        <SettingsSidebar />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
