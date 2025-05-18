import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при получении данных");
        return res.json();
      })
      .then(setUser)
      .catch(() => {
        logout();
        navigate("/login");
      });
  }, []);

  return (
    <div className="container">
      <h1>Личный кабинет</h1>
      {user ? (
        <>
          <p>Имя: {user.username}</p>
          <p>Роль: {user.role}</p>
          {user.role === "admin" && <p style={{ color: "green" }}>👑 Вы администратор!</p>}
          <button onClick={() => { logout(); navigate("/login"); }}>
            Выйти
          </button>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
}
