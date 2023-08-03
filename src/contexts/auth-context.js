// auth-context.js
import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import { request } from "../axios-config";

const AuthContext = createContext();

export const checkTokenExpired = (accessToken) => {
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.exp > Math.round(new Date().getTime() / 1000)) {
        return { user: decoded, accessToken: accessToken };
      }
    } catch (err) {
      console.log("Error decoding token:", err);
    }
  } else {
    return { user: null, accessToken: null };
  }
};

const useToken = () => {
  const [auth, setAuth] = useState({ user: null, accessToken: null });

  const checkAndRefreshToken = async (accessToken) => {
    if (accessToken) {
      const session = checkTokenExpired(accessToken);
      if (session?.accessToken) {
        setAuth(session);
        return true;
      } else {
        // If the token is expired, try to refresh it.
        try {
          const refreshedToken = await request.get("/accesstoken", {
            withCredentials: true,
          });
          if (refreshedToken.data.accessToken) {
            localStorage.setItem("token", refreshedToken.data.accessToken);
            setAuth(checkTokenExpired(refreshedToken.data.accessToken));
            return true;
          } else {
            await request.get("/logout");
            setAuth({ user: null, accessToken: null }); // Clear the access token in the authentication context
            localStorage.removeItem("token"); // Remove the access token from local storage
            return false;
          }
        } catch (error) {
          console.log("Error refreshing token:", error);
          return false;
        }
      }
    }
    return false;
  };

  // useEffect(() => {
  //   const tokenRefreshInterval = setInterval(() => {
  //     checkAndRefreshToken();
  //   }, 60000); // Check and refresh token every minute. Adjust this interval as needed.

  //   // Clean up the interval on unmount.
  //   return () => clearInterval(tokenRefreshInterval);
  // }, []);

  
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    checkAndRefreshToken(accessToken);
  }, []);

  const setAuthToken = (accessToken) => {
    const session = checkTokenExpired(accessToken);
    setAuth(session);
    if (session?.accessToken) {
      localStorage.setItem("token", session?.accessToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  return {
    auth,
    setAuthToken,
  };
};

// Utility function to set the access token and handle token expiration

export const AuthProvider = ({ children }) => {
  const authContextValue = useToken();
  // console.log("authContextValue", authContextValue);
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
