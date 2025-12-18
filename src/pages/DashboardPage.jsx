import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import Calendar from "../components/Calendar/Calendar";
import YearPixels from "../components/Calendar/YearPixels";
import MoodSelector, { MOODS } from "../components/Mood/MoodSelector";

export default function DashboardPage() {
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Fetch entries from API
    // Dades de mostra
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0];

    setEntries({
      [today]: [
        { id: 1, mood: 4, note: "Avui he dormit bé", time: "08:30" },
        { id: 2, mood: 3, note: "Una mica de feina", time: "14:00" },
      ],
      [yesterday]: [
        { id: 3, mood: 2, note: "Dia complicat a la feina", time: "19:00" },
      ],
      [twoDaysAgo]: [
        { id: 4, mood: 5, note: "Dia perfecte!", time: "21:00" },
      ],
    });
  }, []);

  const handleSaveEntry = () => {
    if (!selectedMood) return;

    setSaving(true);

    const now = new Date();
    const time = now.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim(),
      time,
    };

    setEntries((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));

    setSelectedMood(null);
    setNote("");
    setSaving(false);
  };

  const getDayEntries = () => entries[selectedDate] || [];

  const getDayAverage = () => {
    const dayEntries = getDayEntries();
    if (dayEntries.length === 0) return null;
    const avg = dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length;
    return avg.toFixed(1);
  };

  const getStats = () => {
    const allEntries = Object.values(entries).flat();
    const total = allEntries.length;
    if (total === 0) return { total: 0, avg: 0, best: 0, days: 0 };

    const avg = allEntries.reduce((sum, e) => sum + e.mood, 0) / total;
    const best = allEntries.filter((e) => e.mood >= 4).length;
    const days = Object.keys(entries).length;

    return { total, avg: avg.toFixed(1), best, days };
  };

  const formatSelectedDate = () => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString("ca-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getMoodEmoji = (mood) => MOODS.find((m) => m.value === mood)?.emoji || "";

  const stats = getStats();

  return (
    <Layout>
      <div className="page-content">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{stats.days}</div>
            <div className="stat-label">dies</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">entrades</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.avg}</div>
            <div className="stat-label">mitjana</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.best}</div>
            <div className="stat-label">dies bons</div>
          </div>
        </div>

        <div className="dashboard-layout">
          {/* Sidebar esquerra - Calendari */}
          <div className="dashboard-sidebar">
            <Calendar
              entries={entries}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Year in Pixels */}
            <YearPixels
              year={new Date().getFullYear()}
              entries={entries}
              onSelectDate={setSelectedDate}
            />
          </div>

          {/* Centre - Entrades del dia */}
          <div className="dashboard-main">
            {/* Quick Entry */}
            <div className="quick-entry">
              <div className="quick-entry-title">Com et sents ara?</div>
              <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />

              {selectedMood && (
                <div className="quick-entry-note animate-fade-in">
                  <textarea
                    className="textarea"
                    placeholder="Afegeix una nota (opcional)..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                  />
                  <button
                    className="btn btn-primary btn-block mt-1"
                    onClick={handleSaveEntry}
                    disabled={saving}
                  >
                    {saving ? "Guardant..." : "Guardar"}
                  </button>
                </div>
              )}
            </div>

            {/* Entrades del dia seleccionat */}
            <div className="entries-section">
              <div className="entries-header">
                <span className="entries-title">Entrades del dia</span>
                <span className="entries-date">{formatSelectedDate()}</span>
              </div>

              {getDayAverage() && (
                <div className="mood-legend" style={{ justifyContent: "flex-start", padding: "0 0 1rem 0" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Mitjana del dia: <strong>{getDayAverage()}</strong>
                  </span>
                </div>
              )}

              <div className="entry-list">
                {getDayEntries().length === 0 ? (
                  <div className="entry-empty">
                    Cap entrada aquest dia. Com et sents?
                  </div>
                ) : (
                  getDayEntries().map((entry) => (
                    <div key={entry.id} className="entry-item">
                      <div className={`entry-mood mood-${entry.mood}`}>
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div className="entry-content">
                        <div className="entry-time">{entry.time}</div>
                        <div className="entry-text">
                          {entry.note || MOODS.find((m) => m.value === entry.mood)?.label}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar dreta - Llegenda (només desktop) */}
          <div className="dashboard-sidebar" style={{ display: "none" }}>
            <div className="year-pixels">
              <div className="year-pixels-title">Llegenda</div>
              <div className="mood-legend" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                {MOODS.map((mood) => (
                  <div key={mood.value} className="mood-legend-item">
                    <div className={`mood-legend-color`} style={{ background: `var(--mood-${mood.value})` }} />
                    <span>{mood.emoji} {mood.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
