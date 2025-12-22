import axios from "axios";

const API = "http://localhost:8000/feedback";

// Configurar axios per enviar cookies
axios.defaults.withCredentials = true;

export const saveFeedback = async (feedbackData) => {
  const res = await axios.post(`${API}/`, feedbackData);
  return res.data;
};

export const getFeedbackStats = async () => {
  const res = await axios.get(`${API}/stats`);
  return res.data;
};
