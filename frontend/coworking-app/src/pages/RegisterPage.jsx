import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { token, authReady } = useAuth();
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

  const handleRegister = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Ошибка при регистрации");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Регистрация</h1>
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
      <button onClick={handleRegister}>Зарегистрироваться</button>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate("/login")}>Уже есть аккаунт? Войти</button>
    </div>
  );
}
