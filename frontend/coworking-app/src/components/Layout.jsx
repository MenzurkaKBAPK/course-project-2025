import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8081/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Ошибка при получении данных");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении /me:", err);
        setLoading(false);
        logout();
        navigate("/login");
      });
  }, [token]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/me">Профиль</Link>
          <Link to="/booking">Бронирование</Link>
          <Link to="/history">История</Link>
          {user?.role === "admin" && <Link to="/admin">Админка</Link>}
          {token && <button onClick={logout}>Выйти</button>}
        </nav>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  header: {
    background: "#eee",
    padding: "1rem",
    marginBottom: "1rem",
  },
  nav: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  main: {
    padding: "1rem",
  },
};
