import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const decoded = jwtDecode(newToken);
    setUserInfo(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserInfo(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          logout();
        } else {
          setToken(savedToken);
          setUserInfo(decoded);
        }
      } catch (err) {
        logout();
      }
    }
    setAuthReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
