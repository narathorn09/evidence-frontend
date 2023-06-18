import { request } from "../axios-config";
import { useAuth } from "../contexts/auth-context";

const useRefreshToken = () => {
  const { setAuthToken } = useAuth();
  const refresh = async () => {
    const response = await request.get("/accesstoken", {
      withCredentials: true,
    });
    setAuthToken((prev) => {
      console.log(JSON.stringify(prev))
      console.log(response.data.accessToken)
      return {
        ...prev,
        roles: response.data.mem_type,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};
export default useRefreshToken;
