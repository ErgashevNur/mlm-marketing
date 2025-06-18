import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OauthToken() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams);

    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [location, navigate]);
  return <div>Token qabul qilindi. Yuborilyapti...</div>;
}
