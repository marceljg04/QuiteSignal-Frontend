import axios from "axios";

const API = "http://localhost:8000/auth";

export const register = async (name, username, email, password) => {
  const res = await axios.post(
    `${API}/register`,
    { name, username, email, password },
    { withCredentials: true }
  );
  return res.data;
};

export const login = async (username, password) => {
  const res = await axios.post(
    `${API}/login`,
    { username, password },
    { withCredentials: true }
  );
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API}/logout`, {}, { withCredentials: true });
  return res.data;
};