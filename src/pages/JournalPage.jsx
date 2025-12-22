import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { getAllEntries } from "../api/entries";

const MOODS = [
  { value: 1, emoji: "⛈️", label: "Molt malament" },
  { value: 2, emoji: "🌧️", label: "Malament" },
  { value: 3, emoji: "☁️", label: "Normal" },
  { value: 4, emoji: "⛅", label: "Bé" },
  { value: 5, emoji: "☀️", label: "Molt bé" },
];

export default function JournalPage() {
  const [entries, setEntries] = useState({});
  const [filter, setFilter] = useState("all"); // all, 1, 2, 3, 4, 5
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await getAllEntries();
        if (response.success && response.data) {
          // Convertir format API a format frontend
          const formattedEntries = {};
          for (const [date, dayEntries] of Object.entries(response.data)) {
            formattedEntries[date] = dayEntries.map((e) => ({
              id: e.id,
              mood: e.mood,
              note: e.text,
              time: e.time,
            }));
          }
          setEntries(formattedEntries);
        }
      } catch (error) {
        console.error("Error carregant entrades:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const getMoodEmoji = (mood) => {
    const moodData = MOODS.find((m) => m.value === mood);
    return moodData ? moodData.emoji : null;
  };

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

  if (loading) {
    return (
      <Layout>
        <div className="page-content" style={{ maxWidth: "600px" }}>
          <div className="entry-empty">Carregant...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-content" style={{ maxWidth: "600px" }}>
        <div className="entries-section">
          <div className="entries-header">
            <span className="entries-title">Historial</span>
            <span className="entries-date">{totalEntries} entrades</span>
          </div>

          {/* Filtre per mood */}
          <div className="mood-filter">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tots
            </button>
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                className={`filter-btn filter-mood-${mood.value} ${filter === String(mood.value) ? "active" : ""}`}
                onClick={() => setFilter(String(mood.value))}
                title={mood.label}
              >
                <span className="mood-emoji">{mood.emoji}</span>
              </button>
            ))}
          </div>

          {/* Llista d'entrades agrupades per dia */}
          <div className="entry-list">
            {Object.keys(filteredEntries).length === 0 ? (
              <div className="entry-empty">
                {totalEntries === 0 ? "Encara no tens entrades" : "No hi ha entrades amb aquest filtre"}
              </div>
            ) : (
              Object.keys(filteredEntries).map((date) => (
                <div key={date} style={{ marginBottom: "1.5rem" }}>
                  {/* Capçalera del dia */}
                  <div className="day-header">
                    <span className="day-title">
                      {formatDate(date)}
                    </span>
                    <span className="day-average">
                      Mitjana: {getDayAverage(entries[date])}
                    </span>
                  </div>

                  {/* Entrades del dia */}
                  {filteredEntries[date].map((entry) => (
                    <div key={entry.id} className="entry-item">
                      <div className={`entry-mood mood-${entry.mood}`}>
                        <span className="mood-emoji">{getMoodEmoji(entry.mood)}</span>
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
