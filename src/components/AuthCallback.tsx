import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function AuthCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        toast.error(t("AuthCallback.token_not_found"));
        return navigate("/login");
      }

      try {
        localStorage.setItem("token", token);
        sessionStorage.setItem("token2", token);

        const res = await fetch(`${import.meta.env.VITE_API_KEY}/users/token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const user = data.user || data.data?.user || data;
          setUser(user);
          localStorage.setItem("user-data", JSON.stringify(user));
          toast.success(t("AuthCallback.login_success"));
          navigate("/");
        } else {
          throw new Error(t("AuthCallback.user_not_found"));
        }
      } catch (error: any) {
        toast.error(t("AuthCallback.error_occurred"));
        navigate("/login");
      }
    };

    fetchAndSetUser();
  }, []);

  return <p>{t("AuthCallback.redirecting")}</p>;
}
