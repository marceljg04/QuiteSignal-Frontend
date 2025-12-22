const MONTHS = ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"];

export default function YearPixels({ year, entries = {}, onSelectDate }) {
  const getDaysInMonth = (month) => new Date(year, month + 1, 0).getDate();

  const getDateKey = (month, day) => {
    const d = new Date(year, month, day);
    return d.toISOString().split("T")[0];
  };

  const getDayMood = (month, day) => {
    const key = getDateKey(month, day);
    if (!entries[key] || entries[key].length === 0) return null;

    const moods = entries[key].map((e) => e.mood);
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    return Math.round(avg);
  };

  const rows = [];

  for (let month = 0; month < 12; month++) {
    const daysInMonth = getDaysInMonth(month);
    const pixels = [];

    for (let day = 1; day <= 31; day++) {
      if (day <= daysInMonth) {
        const mood = getDayMood(month, day);
        const dateKey = getDateKey(month, day);

        pixels.push(
          <div
            key={`${month}-${day}`}
            className={`year-pixel ${mood ? `mood-${mood}` : ""}`}
            onClick={() => onSelectDate?.(dateKey)}
            title={`${day}/${month + 1}/${year}`}
          />
        );
      } else {
        pixels.push(<div key={`${month}-${day}`} className="year-pixel" style={{ opacity: 0 }} />);
      }
    }

    rows.push(
      <div key={month} className="year-pixels-month">
        {pixels}
      </div>
    );
  }

  return (
    <div className="year-pixels">
      <div className="year-pixels-title">{year} en píxels</div>
      <div className="year-pixels-grid">{rows}</div>
      <div className="year-months">
        {MONTHS.map((m) => (
          <span key={m} className="year-month-label">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
