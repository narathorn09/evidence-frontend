// auth-context.js

import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const checkTokenExpired = (accessToken) => {
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);

      if (decoded.exp > Math.round(new Date().getTime() / 1000)) {
        // console.log(decoded);
        return { user: decoded, accessToken };
      }
    } catch (err) {
      console.log("Error decoding token:", err);
    }
  }

  return { user: null, accessToken: null };
};

const useToken = () => {
  const [auth, setAuth] = useState({ user: null, accessToken: null });

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    const session = checkTokenExpired(accessToken);
    setAuth(session);
  }, []);

  const setAuthToken = (accessToken) => {
    const session = checkTokenExpired(accessToken);
    setAuth(session);
    if (session.accessToken) {
      localStorage.setItem("token", session.accessToken);
    }
    // } else {
    //   localStorage.removeItem("token");
    // }
  };

  return {
    auth,
    setAuthToken,
  };
};

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
