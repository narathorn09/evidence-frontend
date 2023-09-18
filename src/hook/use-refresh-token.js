import { useNavigate } from "react-router-dom";
import { request } from "../axios-config";
import { useAuth } from "../contexts/auth-context";
import Swal from "sweetalert2";

const useRefreshToken = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const refresh = async () => {
    try {
      const response = await request.get("/accesstoken", {
        withCredentials: true,
      });
      await setAuthToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (err) {
      console.error(err);
    }
  };

  return refresh;
};

export default useRefreshToken;
