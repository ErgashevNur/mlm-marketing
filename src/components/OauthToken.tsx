import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function OauthToken() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      toast.success(t("AuthCallback.Successfullylogged"));
      navigate("/dashboard");
    } else {
      toast.error("Token is not defined");
      navigate("/login");
    }
  }, [location, navigate]);

  return <div className="p-4 text-center">Token tekshirilmoqda...</div>;
}

export default OauthToken;
