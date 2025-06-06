import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function AdminPage() {
  const { token, userInfo } = useAuth();

  const [users, setUsers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [places, setPlaces] = useState([]);
  const [newSlot, setNewSlot] = useState({ time: "", place: "" });
  const [newPlace, setNewPlace] = useState("");

  const authHeader = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : null;
  
  if (!userInfo || userInfo.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const fetchAll = () => {
    if (!authHeader || userInfo?.role !== "admin") return;

    fetch("http://localhost:8080/api/users", { headers: authHeader })
      .then((res) => res.json())
      .then(setUsers);

    fetch("http://localhost:8080/api/bookings", { headers: authHeader })
      .then((res) => res.json())
      .then(setSlots);

    fetch("http://localhost:8080/api/workspaces", { headers: authHeader })
      .then((res) => res.json())
      .then(setPlaces);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteUser = async (id) => {
    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    fetchAll();
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "user" ? "admin" : "user";
    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({ role: newRole }),
    });
    fetchAll();
  };

  const addSlot = async () => {
    await fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(newSlot),
    });
    setNewSlot({ time: "", place: "" });
    fetchAll();
  };

  const addPlace = async () => {
    await fetch("http://localhost:8080/api/workspaces", {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ name: newPlace }),
    });
    setNewPlace("");
    fetchAll();
  };

  return (
    <div className="container">
      <h1>👑 Админ-панель</h1>

      <section>
        <h2>Пользователи</h2>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} — {u.role}
              <button onClick={() => toggleRole(u.id, u.role)}>🔁 Роль</button>
              <button onClick={() => deleteUser(u.id)}>🗑 Удалить</button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section>
        <h2>Слоты</h2>
        <ul>
          {slots.map((s) => (
            <li key={s.id}>{s.time} — {s.place}</li>
          ))}
        </ul>
        <h3>Добавить слот</h3>
        <input
          placeholder="Время (например, 14:00)"
          value={newSlot.time}
          onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
        />
        <input
          placeholder="Место"
          value={newSlot.place}
          onChange={(e) => setNewSlot({ ...newSlot, place: e.target.value })}
        />
        <button onClick={addSlot}>Добавить слот</button>
      </section>

      <hr />

      <section>
        <h2>Места</h2>
        <ul>
          {places.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
        <h3>Добавить место</h3>
        <input
          placeholder="Название места"
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
        />
        <button onClick={addPlace}>Добавить место</button>
      </section>
    </div>
  );
}
