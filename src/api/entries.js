import axios from "axios";

const API = "http://localhost:8000/entries";

// Configurar axios per enviar cookies
axios.defaults.withCredentials = true;

export const createEntry = async (entryData) => {
  const res = await axios.post(`${API}/`, entryData);
  return res.data;
};

export const getAllEntries = async (limit = 100, offset = 0) => {
  const res = await axios.get(`${API}/`, { params: { limit, offset } });
  return res.data;
};

export const getEntriesByDate = async (date) => {
  const res = await axios.get(`${API}/date/${date}`);
  return res.data;
};

export const getEntryStats = async () => {
  const res = await axios.get(`${API}/stats`);
  return res.data;
};

export const getEntry = async (entryId) => {
  const res = await axios.get(`${API}/${entryId}`);
  return res.data;
};

export const updateEntry = async (entryId, updateData) => {
  const res = await axios.put(`${API}/${entryId}`, updateData);
  return res.data;
};

export const deleteEntry = async (entryId) => {
  const res = await axios.delete(`${API}/${entryId}`);
  return res.data;
};
