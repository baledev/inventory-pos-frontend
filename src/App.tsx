import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/login-page";
import DashboardPage from "./pages/dashboard";
import { AuthProvider, useAuth } from "./context/auth-context";
import { Toaster } from "sonner";
import ProductManagementPage from "./pages/products/product-page";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={
            <ProtectedRoute><ProductManagementPage /></ProtectedRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}