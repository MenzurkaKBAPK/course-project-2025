import jwt_decode from "jwt-decode";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = (newToken) => {
    setToken(newToken);
    const decoded = jwt_decode(newToken);
    setUserInfo(decoded);
  };

  const logout = () => {
    setToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
