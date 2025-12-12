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