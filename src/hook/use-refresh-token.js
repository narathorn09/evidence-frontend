import { useNavigate } from "react-router-dom";
import { request } from "../axios-config";
import { useAuth } from "../contexts/auth-context";

const useRefreshToken = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const refresh = async () => {
    try {
      const response = await request.get("/accesstoken", {
        withCredentials: true,
      });
      setAuthToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (err) {
      navigate("/login");
    }
  };

  return refresh;
};

export default useRefreshToken;
