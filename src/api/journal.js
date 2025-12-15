import axios from "axios";

const API = "http://localhost:8000/journals";

export const createJournal = async (title = "My Journal") => {
  const res = await axios.post(
    `${API}?title=${encodeURIComponent(title)}`,
    {},
    { withCredentials: true }
  );

  return res.data;
};

export const getMyJournal = async () => {
  const res = await axios.get(`${API}/me`, { withCredentials: true });
  return res.data;
};

export const getEntries = async (journalId) => {
  const res = await axios.get(`${API}/${journalId}/entries`, { withCredentials: true });
  return res.data;
};

export const createEntry = async (journalId) => {
  const res = await axios.post(`${API}/${journalId}/entries`, {}, { withCredentials: true });
  return res.data;
};

export const appendBatch = async (journalId, entryId, paragraphs = []) => {
  const res = await axios.post(
    `${API}/${journalId}/entries/${entryId}/append-batch`,
    { paragraphs },
    { withCredentials: true }
  );
  return res.data;
};

export const getEntry = async (journalId, entryId) => {
  const res = await axios.get(
    `${API}/${journalId}/entries/${entryId}`,
    { withCredentials: true }
  );
  return res.data;
};