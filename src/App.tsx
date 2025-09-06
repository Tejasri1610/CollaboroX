 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Tasks from "./pages/Tasks";
import ForgotPassword from "./pages/Forgot";
import Cookies from "js-cookie";
import SynergyAI from "./pages/SynergyAI";
const queryClient = new QueryClient();

// Mock auth check - replace with real auth logic
const isAuthenticated = () => {
  const tokenFromLocalStorage = localStorage.getItem("collaborox_token");
  const tokenFromCookie = Cookies.get("collaborox_token");
  return !!tokenFromLocalStorage || !!tokenFromCookie;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/signup" element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          } />
          <Route path="/forgot" element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          } />
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="SynergyAI" element={<SynergyAI />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            <Route path="/projects/:projectId/tasks" element={<Tasks />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            {/* <Route path="/forgot" element={< ForgotPassword/>} /> */}
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;