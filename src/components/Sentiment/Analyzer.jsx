import { useState } from "react";
import { analyzePhrase } from "../../api/analyze";

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    if (!text) {
      setError("Please enter a phrase");
      return;
    }
    try {
      const res = await analyzePhrase(text);
      if (res.success) {
        setResult(res.data.label);
      } else {
        setError(res.errors || res.message || "Analysis failed");
      }
    } catch {
      setError("Analysis failed");
    }
  };

  return (
    <div className="analyzer-container">
      {error && <p className="error-text">{error}</p>}
      <textarea
        className="textarea"
        placeholder="Enter a phrase..."
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        onClick={handleAnalyze}
        className="btn btn-success"
      >
        Analyze
      </button>
      {result && (  
        <p className="analyzer-result">
          Sentiment: {result}
        </p>
      )}
    </div>
  );
}
