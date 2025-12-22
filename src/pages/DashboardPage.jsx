import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import Layout from "../components/Layout/Layout";
import Calendar from "../components/Calendar/Calendar";
import YearPixels from "../components/Calendar/YearPixels";
import { analyzePhrase } from "../api/analyze";
import { saveFeedback } from "../api/feedback";
import { getAllEntries, createEntry, getEntryStats } from "../api/entries";

const MOODS = [
  { value: 1, emoji: "⛈️", label: "Molt malament" },
  { value: 2, emoji: "🌧️", label: "Malament" },
  { value: 3, emoji: "☁️", label: "Normal" },
  { value: 4, emoji: "⛅", label: "Bé" },
  { value: 5, emoji: "☀️", label: "Molt bé" },
];

export default function DashboardPage() {
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null); // Guardem la resposta completa de l'API
  const [justSaved, setJustSaved] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bon dia";
    if (hour < 18) return "Bona tarda";
    return "Bona nit";
  };

  const getPrompt = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Com comences el dia?";
    if (hour < 18) return "Com va la tarda?";
    return "Com ha anat el dia?";
  };

  const getStreak = () => {
    const dates = Object.keys(entries).sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of dates) {
      const entryDate = new Date(dateStr);
      entryDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    return streak;
  };

  // Carregar entrades al muntar el component
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
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  // Converteix el resultat de l'API (negative/neutral/positive + probabilitats) a mood 1-5
  const labelToMood = (label, probabilities) => {
    // L'API retorna: label = "negative" | "neutral" | "positive"
    // probabilities = { "0": prob_neg, "1": prob_neutral, "2": prob_positive }

    const negProb = probabilities["0"] || 0;
    const neutralProb = probabilities["1"] || 0;
    const posProb = probabilities["2"] || 0;

    if (label === "negative") {
      // Si és molt negatiu (alta probabilitat), mood 1; si no, mood 2
      return negProb > 0.7 ? 1 : 2;
    } else if (label === "positive") {
      // Si és molt positiu (alta probabilitat), mood 5; si no, mood 4
      return posProb > 0.7 ? 5 : 4;
    } else {
      // Neutral = mood 3
      return 3;
    }
  };

  // Analitza el sentiment cridant l'API del backend
  const analyzeSentiment = async (text) => {
    try {
      const response = await analyzePhrase(text);

      if (response.success && response.data) {
        const { label, probabilities } = response.data;
        // Guardem la resposta completa per enviar-la després amb el feedback
        setAnalysisResult({ label, probabilities });
        return labelToMood(label, probabilities);
      }

      // Fallback si hi ha error
      setAnalysisResult({ label: "neutral", probabilities: { "0": 0.2, "1": 0.6, "2": 0.2 } });
      return 3;
    } catch (error) {
      console.error("Error analitzant sentiment:", error);
      // Fallback a neutral si falla l'API
      setAnalysisResult({ label: "neutral", probabilities: { "0": 0.2, "1": 0.6, "2": 0.2 } });
      return 3;
    }
  };

  const handleSubmit = async () => {
    if (!note.trim()) return;

    setAnalyzing(true);

    // Analitzar el sentiment
    const mood = await analyzeSentiment(note);
    setDetectedMood(mood);
    setAnalyzing(false);
  };

  const handleConfirmSave = async (finalMood) => {
    setSaving(true);

    const now = new Date();
    const time = now.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });

    // Guardar feedback per millorar el model
    if (analysisResult) {
      try {
        await saveFeedback({
          text: note.trim(),
          predicted_label: analysisResult.label,
          predicted_probabilities: analysisResult.probabilities,
          predicted_mood: detectedMood,
          corrected_mood: finalMood,
        });
      } catch (error) {
        console.error("Error guardant feedback:", error);
        // Continuem encara que falli el feedback
      }
    }

    // Guardar entrada a la base de dades
    try {
      const response = await createEntry({
        text: note.trim(),
        mood: finalMood,
        date: selectedDate,
        time: time,
      });

      if (response.success && response.data) {
        const newEntry = {
          id: response.data.id,
          mood: response.data.mood,
          note: response.data.text,
          time: response.data.time,
        };

        setEntries((prev) => ({
          ...prev,
          [selectedDate]: [...(prev[selectedDate] || []), newEntry],
        }));

        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      } else {
        console.error("Error guardant entrada:", response.message);
      }
    } catch (error) {
      console.error("Error guardant entrada:", error);
    }

    setNote("");
    setDetectedMood(null);
    setAnalysisResult(null);
    setSaving(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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

  const getMoodEmoji = (mood) => {
    const moodData = MOODS.find((m) => m.value === mood);
    return moodData ? moodData.emoji : null;
  };

  const stats = getStats();

  return (
    <Layout>
      <div className="page-content">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{getStreak()}</div>
            <div className="stat-label">ratxa</div>
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
            <div className="stat-value">{stats.days}</div>
            <div className="stat-label">dies</div>
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
              {justSaved ? (
                <div className="quick-entry-success animate-fade-in">
                  <span className="success-icon">✓</span>
                  <span>Guardat</span>
                </div>
              ) : detectedMood ? (
                <div className="mood-result animate-fade-in">
                  <div className="mood-result-label">Com et sents:</div>
                  <div className="mood-result-options">
                    {MOODS.map((mood) => (
                      <button
                        key={mood.value}
                        className={`mood-result-btn mood-${mood.value} ${detectedMood === mood.value ? "detected" : ""}`}
                        onClick={() => handleConfirmSave(mood.value)}
                        title={mood.label}
                      >
                        <span className="mood-emoji">{mood.emoji}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mood-result-hint">
                    Hem detectat: <strong>{MOODS.find(m => m.value === detectedMood)?.label}</strong>
                    <br />
                    <span className="hint-small">Clica per confirmar o tria un altre</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="quick-entry-greeting">{getGreeting()}</div>
                  <div className="quick-entry-title">{getPrompt()}</div>
                  <div className="journal-input-container">
                    <textarea
                      className="journal-textarea"
                      placeholder="Escriu com et sents..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={3}
                    />
                    <button
                      className="journal-submit"
                      onClick={handleSubmit}
                      disabled={!note.trim() || analyzing}
                      title="Enviar (Enter)"
                    >
                      {analyzing ? (
                        <span className="analyzing-dots">...</span>
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Entrades del dia seleccionat */}
            <div className="entries-section">
              <div className="entries-header">
                <span className="entries-title">Entrades del dia</span>
                <span className="entries-date">{formatSelectedDate()}</span>
              </div>

              {getDayAverage() && (
                <div className="day-average-display">
                  <span>
                    Mitjana del dia: <strong>{getDayAverage()}</strong>
                  </span>
                </div>
              )}

              <div className="entry-list">
                {getDayEntries().length === 0 ? (
                  <div className="entry-empty">
                    Cap entrada aquest dia
                  </div>
                ) : (
                  getDayEntries().map((entry) => (
                    <div key={entry.id} className="entry-item">
                      <div className={`entry-mood mood-${entry.mood}`}>
                        <span className="mood-emoji">{getMoodEmoji(entry.mood)}</span>
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
        </div>
      </div>
    </Layout>
  );
}
