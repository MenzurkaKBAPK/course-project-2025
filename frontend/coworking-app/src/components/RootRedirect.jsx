import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function RootRedirect() {
  const { token, authReady } = useAuth();

  if (!authReady) return null;
  return <Navigate to={token ? "/me" : "/login"} />;
}
