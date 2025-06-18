import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function OauthToken() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Tizimga muvaffaqiyatli kirildi");
      navigate("/dashboard");
    } else {
      toast.error("Token topilmadi. Qayta urinib ko‘ring.");
      navigate("/login");
    }
  }, [location, navigate]);

  return <div className="p-4 text-center">Token tekshirilmoqda...</div>;
}

export default OauthToken;
