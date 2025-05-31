
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CredentialsProvider } from "./contexts/CredentialsContext";
import { InstanceProvider } from "./contexts/InstanceContext";
import { AdminProvider } from "./contexts/AdminContext";
import { RequireAuth } from "./components/auth/RequireAuth";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import CredentialsPage from "./pages/CredentialsPage";
import DashboardPage from "./pages/DashboardPage";
import InstancePage from "./pages/InstancePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminInstancesPage from "./pages/AdminInstancesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CredentialsProvider>
          <InstanceProvider>
            <AdminProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                
                {/* Protected User Routes */}
                <Route path="/credentials" element={<RequireAuth><CredentialsPage /></RequireAuth>} />
                <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="/me" element={<RequireAuth><ProfileDetailsPage /></RequireAuth>} />
                <Route path="/instance" element={<RequireAuth><InstancePage /></RequireAuth>} />
                <Route path="/subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
                <Route path="/admin/instances" element={<RequireAuth><AdminInstancesPage /></RequireAuth>} />
                <Route path="/admin/users" element={<RequireAuth><AdminUsersPage /></RequireAuth>} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </AdminProvider>
          </InstanceProvider>
        </CredentialsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
