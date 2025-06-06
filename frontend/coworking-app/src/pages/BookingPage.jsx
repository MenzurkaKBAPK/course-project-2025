import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import SlotSelector from "../components/SlotSelector";

export default function BookingPage() {
  const { token } = useAuth();
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleBook = async () => {
    if (!selected) return;
    setMessage("");

    const res = await fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slotId: selected.id }),
    });

    if (res.ok) {
      setMessage("Бронирование успешно!");
    } else {
      setMessage("Ошибка при бронировании.");
    }
  };

  return (
    <div className="container">
      <h1>Бронирование</h1>
      <SlotSelector onSelect={setSelected} />
      {selected && (
        <div>
          <p>Выбран: {selected.time} — {selected.place}</p>
          <button onClick={handleBook}>Забронировать</button>
        </div>
      )}
      {message && <p>{message}</p>}
      <button onClick={() => navigate("/history")}>История</button>
    </div>
  );
}
