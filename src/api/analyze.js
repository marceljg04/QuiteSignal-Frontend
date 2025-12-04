import axios from "axios";

const API = "http://localhost:8000/analyze";

export const analyzePhrase = async (text) => {
  const res = await axios.post(`${API}`, { text });
  return res.data;
};