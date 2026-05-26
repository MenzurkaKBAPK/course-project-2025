import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function BookingHistoryPage() {
  const { token, userInfo } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/bookings/user/${userInfo.user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setHistory);
  }, []);

  return (
    <div className="container">
      <h1>История бронирований</h1>
      <ul>
        {history.map((b) => (
          <li key={b.id}>
            {b.date} — {b.time} — место {b.place}
          </li>
        ))}
      </ul>
    </div>
  );
}
