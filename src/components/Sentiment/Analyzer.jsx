import { useState } from "react";
import { analyzePhrase } from "../../api/analyze";

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!text.trim()) {
      setError("Escriu alguna cosa primer...");
      return;
    }

    setLoading(true);
    try {
      const res = await analyzePhrase(text);
      if (res.success) {
        setResult({
          label: res.data.label,
          probabilities: res.data.probabilities
        });
      } else {
        setError(res.errors || res.message || "No s'ha pogut analitzar");
      }
    } catch (err) {
      setError(err.message || "No s'ha pogut analitzar");
    } finally {
      setLoading(false);
    }
  };

  const getConfidence = () => {
    if (!result?.probabilities) return null;
    const labelMap = { negative: "0", neutral: "1", positive: "2" };
    const key = labelMap[result.label];
    const confidence = result.probabilities[key];
    return confidence ? Math.round(confidence * 100) : null;
  };

  const getSentimentText = (label) => {
    const texts = {
      positive: "Et sents bé!",
      neutral: "Un dia normal",
      negative: "Sembla un dia difícil..."
    };
    return texts[label] || label;
  };

  return (
    <div className="card card-lg animate-fade-in">
      <h2 className="card-title">Com em sento?</h2>
      <p className="card-subtitle">
        Escriu el que penses i t'ajudaré a entendre com et sents
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Què tens al cap?</label>
        <textarea
          className="textarea"
          placeholder="Escriu aquí el que vulguis... pots escriure en qualsevol idioma"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="btn btn-success btn-block"
        disabled={loading}
      >
        {loading ? "Analitzant..." : "Com em sento?"}
      </button>

      {result && (
        <div className={`sentiment-result ${result.label}`}>
          <div className="sentiment-label">
            {getSentimentText(result.label)}
          </div>
          {getConfidence() && (
            <div className="sentiment-confidence">
              Certesa: {getConfidence()}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
