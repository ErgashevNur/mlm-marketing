import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import EarningsPage from "./pages/EarningsPage";
import ReferralsPage from "./pages/ReferralsPage";
import PlansPage from "./pages/PlansPage";
import WithdrawPage from "./pages/WithdrawPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./i18n/config";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route
                              path="/earnings"
                              element={<EarningsPage />}
                            />
                            <Route
                              path="/referrals"
                              element={<ReferralsPage />}
                            />
                            <Route path="/plans" element={<PlansPage />} />
                            <Route
                              path="/withdraw"
                              element={<WithdrawPage />}
                            />
                            <Route
                              path="/products"
                              element={<ProductsPage />}
                            />
                            <Route
                              path="/products/:id"
                              element={<ProductDetailPage />}
                            />
                            <Route
                              path="/checkout"
                              element={<CheckoutPage />}
                            />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Redirect to landing page */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </>
  );
}

export default App;
