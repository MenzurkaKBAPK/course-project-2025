import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { token, logout } = useAuth();

  return (
    <div>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/me">Профиль</Link>
          <Link to="/booking">Бронирование</Link>
          <Link to="/history">История</Link>
          <Link to="/admin">Админка</Link>
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
