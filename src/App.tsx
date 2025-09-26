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
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const url = "https://aeditus.com";

  useEffect(() => {
    const redirect = () => {
      try {
        if (window.top) {
          window.top.location.href = url;
        } else {
          window.location.replace(url);
        }
      } catch (e) {
        window.location.replace(url);
      }
    };

    redirect();
    const t = setTimeout(() => {
      window.location.assign(url);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <main className="min-h-screen grid place-items-center bg-background">
            <section className="text-center space-y-4 p-6">
              <h1 className="text-2xl font-semibold">Redirection vers aeditus.com…</h1>
              <p className="text-muted-foreground">Si rien ne se passe, cliquez sur le bouton ci-dessous.</p>
              <a
                href={url}
                target="_top"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Aller sur aeditus.com
              </a>
            </section>
          </main>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
