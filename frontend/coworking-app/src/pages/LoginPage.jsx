import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { token, login, authReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authReady) return;
    if (token && location.pathname === "/login") {
      navigate("/me");
    }
  }, [token, authReady, location.pathname, navigate]);

  if (!authReady) {
    return <div>Загрузка...</div>;
  }

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Неверный логин или пароль");

      const data = await res.json();
      login(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Вход</h1>
      <input
        type="text"
        placeholder="Имя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Войти</button>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate("/register")}>Нет аккаунта? Зарегистрироваться</button>
    </div>
  );
}
