import { useState } from "react";

const WEEKDAYS = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];
const MONTHS = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];

export default function Calendar({ entries = {}, selectedDate, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Ajustar per començar dilluns (0 = dilluns, 6 = diumenge)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    return day === d.getDate() && month === d.getMonth() && year === d.getFullYear();
  };

  const getDateKey = (day) => {
    const d = new Date(year, month, day);
    return d.toISOString().split("T")[0];
  };

  const getDayMood = (day) => {
    const key = getDateKey(day);
    if (!entries[key] || entries[key].length === 0) return null;

    // Calcular mood promig del dia
    const moods = entries[key].map((e) => e.mood);
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    return Math.round(avg);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    const dateStr = getDateKey(day);
    onSelectDate?.(dateStr);
  };

  const days = [];

  // Espais buits abans del primer dia
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }

  // Dies del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const mood = getDayMood(day);
    let className = "calendar-day";

    if (isToday(day)) className += " today";
    if (isSelected(day)) className += " selected";
    if (mood) className += ` has-entry mood-${mood}`;

    days.push(
      <div key={day} className={className} onClick={() => handleDayClick(day)}>
        {day}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span className="calendar-title">
          {MONTHS[month]} {year}
        </span>
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={prevMonth}>
            ‹
          </button>
          <button className="calendar-nav-btn" onClick={nextMonth}>
            ›
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">{days}</div>
    </div>
  );
}
