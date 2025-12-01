import axios from "axios";

const API = "http://localhost:8000";

export const login = async (user, password) => {
  const res = await axios.post(`${API}/login`, {
    username: user,
    password,
  });
  return res.data;
};

export const register = async (username, email, password) => {
  const res = await axios.post(`${API}/register`, {
    username,
    email,
    password,
  });
  return res.data;
};