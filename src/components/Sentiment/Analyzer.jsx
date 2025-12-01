import { useState } from "react";
import { analyzePhrase } from "../api/analyze";

export default function Analyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const handleAnalyze = async () => {
    const res = await analyzePhrase(text);
    setResult(res.sentiment);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <textarea
        className="w-full border p-3 rounded mb-3"
        placeholder="Escribe una frase..."
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button
        onClick={handleAnalyze}
        className="bg-green-600 text-white p-2 rounded w-full"
      >
        Analizar
      </button>

      {result && (
        <p className="mt-4 text-xl font-bold text-center">
          Estado emocional: {result}
        </p>
      )}
    </div>
  );

}
