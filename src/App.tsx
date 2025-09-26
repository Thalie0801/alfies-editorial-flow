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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/simulateur" element={<Simulator />} />
            <Route path="/ambassadeur" element={<AmbassadorApplication />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute requiredRole="client" requireSubscription={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings/billing" element={
              <ProtectedRoute requiredRole="client">
                <BillingSettings />
              </ProtectedRoute>
            } />
            <Route path="/settings/engagement" element={
              <ProtectedRoute requiredRole="client">
                <EngagementSettings />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
