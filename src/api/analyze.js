import axios from "axios";

const API = "http://localhost:8000/analyze";

// Configurar axios per enviar cookies
axios.defaults.withCredentials = true;

export const analyzePhrase = async (text) => {
  const res = await axios.post(`${API}`, { text });
  return res.data;
};