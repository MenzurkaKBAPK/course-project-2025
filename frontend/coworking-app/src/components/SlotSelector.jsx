import { useEffect, useState } from "react";

export default function SlotSelector({ onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/slots/available")
      .then((res) => res.json())
      .then(setSlots)
      .catch(() => setSlots([]));
  }, []);

  return (
    <div>
      <h3>Выберите слот</h3>
      {slots.length === 0 && <p>Нет доступных слотов</p>}
      <ul>
        {slots.map((slot) => (
          <li key={slot.id}>
            <button onClick={() => onSelect(slot)}>{slot.time} — {slot.place}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
