import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  coin: number;
  userTariff: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    referal?: number
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  claimDailyBonus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user-data");

        // Agar token yo‘q, lekin user-data mavjud bo‘lsa, uni qayta o‘qish
        if (!token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
          return;
        }

        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_KEY}/users/token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("API response:", data);

        if (response.ok) {
          const userData = data.user || data;
          setUser(userData);
          localStorage.setItem("user-data", JSON.stringify(userData));
        } else {
          console.error(
            "API error:",
            data.message || "Failed to fetch user data"
          );
          // localStorage.removeItem("token");
          localStorage.removeItem("user-data");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // localStorage.removeItem("token");
        localStorage.removeItem("user-data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/authorization/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const userData = data.data.user || data.user;
      setUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user-data", JSON.stringify(userData));
      console.log("Stored user-data:", userData);
      toast.success(data.message || "Login successful");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    referal?: number
  ) => {
    setIsLoading(true);
    try {
      const body: any = { name, email, password };
      if (referal !== undefined) {
        body.referal = referal; // referal number sifatida yuboriladi
      }

      const response = await fetch(
        "https://mlm-backend.pixl.uz/authorization/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      localStorage.setItem("email", email);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user-data", JSON.stringify(userData));
      console.log("Stored user-data:", userData);
      toast.success(
        data.message ||
          "Registration successful! Please check your email to verify your account."
      );
      return data;
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      window.location.href = "https://mlm-backend.pixl.uz/authorization/google";
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: "3",
        name: "Facebook User",
        email: "user@facebook.com",
        createdAt: Date.now(),
        coin: 0,
        userTariff: "free",
      };
      setUser(mockUser);
      localStorage.setItem("user-data", JSON.stringify(mockUser));
      toast.success("Facebook login successful");
    } catch (error: any) {
      toast.error(error.message || "Facebook login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const claimDailyBonus = () => {
    if (user) {
      // Custom bonus logic goes here
      toast.success("Daily bonus claimed!");
    } else {
      toast.error("You must be logged in to claim the bonus");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user-data");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    isLoading,
    claimDailyBonus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
