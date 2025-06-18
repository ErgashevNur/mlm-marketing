import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OauthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL query stringdan tokenni olish
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      // localStorage ga tokenni saqlash
      localStorage.setItem("token", token);

      // foydalanuvchini boshqa sahifaga yo'naltirish, masalan dashboard
      navigate("/dashboard");
    } else {
      // token yo'q bo'lsa, login sahifasiga yo'naltirish
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Redirecting...</p>;
};

export default OauthSuccess;
