import axios from "axios";

const API = axios.create({
  baseURL: "https://asuragpt-2.onrender.com/api",
  withCredentials: true, // allows cookies/session tokens
});

export default API;
