import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        console.log("Token is valid");
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);
};

export default useAuthCheck;