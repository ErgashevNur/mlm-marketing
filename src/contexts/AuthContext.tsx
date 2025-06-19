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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    referal?: string
  ) => Promise<void>;
  loginWithGoogle: () => void;
  // googleRefSistem: () => void;
  loginWithFacebook: () => void;
  logout: () => void;
  isLoading: boolean;
  claimDailyBonus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user-data") || "null")
  );

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token2");
      if (!token) {
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/users/token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const user = data.user || data.data?.user || data;
        setUser(user);
        localStorage.setItem("user-data", JSON.stringify(user));
      } else {
        throw new Error("Token check failed");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
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
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}/authorization/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setUser(data.data.user);
      localStorage.setItem("token", data.token);
      sessionStorage.setItem("token2", data.token);
      localStorage.setItem("user-data", JSON.stringify(data.data.user));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || "Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    referal?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}/authorization/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, referal }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Registration successful!");
      localStorage.setItem("email", email);
      // setUser(data.data?.user || null);
      // localStorage.setItem("user-data", JSON.stringify(data.data.user));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    // const id = localStorage.getItem("referral_id");
    // fetch(`${import.meta.env.VITE_API_KEY}/authorization/google`)
    //   .then(console.log)
    //   .catch(console.log);

    try {
      window.location.href = `${
        import.meta.env.VITE_API_KEY
      }/authorization/google`;
    } catch (error: any) {
      toast.warning(error.message || "Registration failed");
      throw error; // Re-throw the error for handleSubmit to catch
    } finally {
      setIsLoading(false);
    }

    localStorage.setItem("data", window.location.href);

    // code written by_codenur
    // referal with google
  };

  // const loginWithFacebook = () => {
  //   window.location.href = `${
  //     import.meta.env.VITE_API_KEY
  //   }/authorization/facebook`;
  // };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token2");
    localStorage.removeItem("user-data");
    setUser(null);
  };

  const claimDailyBonus = () => {
    if (user?.userTariff.status) {
      toast.success("Bonus claimed!");
    } else {
      toast.error("Log in first");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        loginWithGoogle,
        logout,
        isLoading,
        claimDailyBonus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
