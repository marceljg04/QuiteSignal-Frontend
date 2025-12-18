import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";

const MOODS = [
  { value: 1, emoji: "😢", label: "Molt malament" },
  { value: 2, emoji: "😔", label: "Malament" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "🙂", label: "Bé" },
  { value: 5, emoji: "😊", label: "Molt bé" },
];

export default function JournalPage() {
  const [entries, setEntries] = useState({});
  const [filter, setFilter] = useState("all"); // all, 1, 2, 3, 4, 5

  useEffect(() => {
    // TODO: Fetch from API
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0];
    const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0];

    setEntries({
      [today]: [
        { id: 1, mood: 4, note: "Avui he dormit molt bé i he tingut un matí productiu", time: "08:30" },
        { id: 2, mood: 3, note: "Reunió llarga a la feina", time: "14:00" },
        { id: 6, mood: 5, note: "Sopar amb amics!", time: "21:00" },
      ],
      [yesterday]: [
        { id: 3, mood: 2, note: "Dia complicat, massa estrès", time: "19:00" },
        { id: 7, mood: 3, note: "", time: "22:00" },
      ],
      [twoDaysAgo]: [
        { id: 4, mood: 5, note: "Excursió a la muntanya, dia perfecte", time: "18:00" },
      ],
      [threeDaysAgo]: [
        { id: 5, mood: 1, note: "Malalt, he hagut de quedar al llit", time: "10:00" },
        { id: 8, mood: 2, note: "Encara malalt però una mica millor", time: "20:00" },
      ],
    });
  }, []);

  const getMoodEmoji = (mood) => MOODS.find((m) => m.value === mood)?.emoji || "";
  const getMoodLabel = (mood) => MOODS.find((m) => m.value === mood)?.label || "";

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (d.toDateString() === today.toDateString()) return "Avui";
    if (d.toDateString() === yesterday.toDateString()) return "Ahir";

    return d.toLocaleDateString("ca-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getDayAverage = (dayEntries) => {
    if (!dayEntries || dayEntries.length === 0) return null;
    return (dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length).toFixed(1);
  };

  const getFilteredEntries = () => {
    const result = {};

    Object.keys(entries)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const dayEntries = entries[date];
        const filtered = filter === "all"
          ? dayEntries
          : dayEntries.filter((e) => e.mood === parseInt(filter));

        if (filtered.length > 0) {
          result[date] = filtered;
        }
      });

    return result;
  };

  const filteredEntries = getFilteredEntries();
  const totalEntries = Object.values(entries).flat().length;

  return (
    <Layout>
      <div className="page-content" style={{ maxWidth: "600px" }}>
        <div className="entries-section">
          <div className="entries-header">
            <span className="entries-title">Historial</span>
            <span className="entries-date">{totalEntries} entrades</span>
          </div>

          {/* Filtre per mood */}
          <div className="mood-legend" style={{ marginBottom: "1rem", gap: "0.5rem" }}>
            <button
              className={`btn ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
              style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
              onClick={() => setFilter("all")}
            >
              Tots
            </button>
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                className={`btn ${filter === String(mood.value) ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                onClick={() => setFilter(String(mood.value))}
              >
                {mood.emoji}
              </button>
            ))}
          </div>

          {/* Llista d'entrades agrupades per dia */}
          <div className="entry-list">
            {Object.keys(filteredEntries).length === 0 ? (
              <div className="entry-empty">
                No hi ha entrades amb aquest filtre
              </div>
            ) : (
              Object.keys(filteredEntries).map((date) => (
                <div key={date} style={{ marginBottom: "1.5rem" }}>
                  {/* Capçalera del dia */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid var(--border)"
                  }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {formatDate(date)}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Mitjana: {getDayAverage(entries[date])}
                    </span>
                  </div>

                  {/* Entrades del dia */}
                  {filteredEntries[date].map((entry) => (
                    <div key={entry.id} className="entry-item">
                      <div className={`entry-mood mood-${entry.mood}`}>
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div className="entry-content">
                        <div className="entry-time">{entry.time}</div>
                        <div className="entry-text">
                          {entry.note || getMoodLabel(entry.mood)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
