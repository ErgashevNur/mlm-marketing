import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function AuthCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        toast.error("Token topilmadi");
        return navigate("/login");
      }

      try {
        localStorage.setItem("token", token);
        sessionStorage.setItem("token2", token);

        const res = await fetch(`https://mlm-backend.pixl.uz/users/token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const user = data.user || data.data?.user || data;
          setUser(user);
          localStorage.setItem("user-data", JSON.stringify(user));
          toast.success("Tizimga muvaffaqiyatli kirdingiz!");
          navigate("/");
        } else {
          throw new Error(data.message || "Foydalanuvchi topilmadi");
        }
      } catch (error: any) {
        toast.error(error.message || "Xatolik yuz berdi");
        navigate("/login");
      }
    };

    fetchAndSetUser();
  }, []);

  return <p>Redirecting, iltimos kuting...</p>;
}
