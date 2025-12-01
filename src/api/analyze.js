import axios from "axios";

const API = "http://localhost:8000";

export const analyzePhrase = async (text) => {
  const res = await axios.post(`${API}/analyze`, { text });
  return res.data;
};
