import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import { Simulator } from "./pages/Simulator";
import { AmbassadorApplication } from "./pages/AmbassadorApplication";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { BillingSettings } from "./pages/BillingSettings";
import { EngagementSettings } from "./pages/EngagementSettings";
import { ProtectedRoute } from "./components/dashboard/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  // Redirection vers aeditus.com
  window.location.href = "https://aeditus.com";
  return null;
};

export default App;
