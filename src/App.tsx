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

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";
import BonusHistory from "./components/BonusHistory";
import AuthCallback from "./components/AuthCallback";
import OauthToken from "./components/OauthToken";

import "./i18n/config";
import AboutPage from "./pages/AboutPage";

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
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* OAuth callbacks - outside dashboard */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/oauth-success" element={<OauthToken />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="earnings" element={<EarningsPage />} />
                    <Route path="referrals" element={<ReferralsPage />} />
                    <Route path="plans" element={<PlansPage />} />
                    <Route path="withdraw" element={<WithdrawPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route
                      path="products/:id"
                      element={<ProductDetailPage />}
                    />
                    <Route path="bonusHistory" element={<BonusHistory />} />
                  </Route>

                  {/* Not found */}
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
