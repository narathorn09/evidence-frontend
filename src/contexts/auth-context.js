// auth-context.js

import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const checkTokenExpired = (token) => {
  if (token) {
    try {

      const decoded = jwtDecode(token);
      
      if (decoded.exp > Math.round(new Date().getTime() / 1000)) {
        console.log(decoded)
        return { user: decoded, token };
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  return { user: null, token: null };
};

const useToken = () => {
  const [auth, setAuth] = useState({ user: null, token: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const session = checkTokenExpired(token);
    setAuth(session);
  }, []);

  const setAuthToken = (token) => {
    const session = checkTokenExpired(token);
    setAuth(session);
    if (session.token) {
      localStorage.setItem("token", session.token);
    } else {
      localStorage.removeItem("token");
    }
  };

  return {
    auth,
    setAuthToken,
  };
};

export const AuthProvider = ({ children }) => {
  const authContextValue = useToken();

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
