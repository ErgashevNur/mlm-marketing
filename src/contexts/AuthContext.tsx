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
    referal: number
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

  const fetchUserData = async () => {
    try {
      const token =
        localStorage.getItem("token") === null &&
        sessionStorage.getItem("token2");
      if (!token) {
        setIsLoading(false);
        return;
      }

      console.log(token);

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
      console.log(response);

      if (response.ok) {
        setUser(data);
        // yoki setUser(data.user), agar API shunaqa qaytarsa
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

      setUser(data.data.user);

      localStorage.setItem("token", data.token);
      sessionStorage.setItem("token2", data.token);

      localStorage.setItem("user-data", JSON.stringify(data.data.user));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // rester
  const register = async (
    name: string,
    email: string,
    password: string,
    referal?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mlm-backend.pixl.uz/authorization/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, referal }),
        }
      );

      const data = await response.json();
      localStorage.setItem("email", email); // Store email on success

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(
        data.message ||
          "Registration successful! Please check your email to verify your account."
      );
      setUser(data);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error; // Re-throw the error for handleSubmit to catch
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      window.location.href = "https://mlm-backend.pixl.uz/authorization/google";
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: "3",
      name: "Facebook User",
      email: "user@facebook.com",
    };

    setUser(mockUser);
    localStorage.setItem("user-data", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const claimDailyBonus = () => {
    if (user) {
      toast.success("Daily bonus claimed!");
    } else {
      toast.error("You must be logged in to claim the bonus");
    }
  };

  const logout = () => {
    localStorage.removeItem("user-data");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token2");
    setUser(null); // foydalanuvchini ham tozalash
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
