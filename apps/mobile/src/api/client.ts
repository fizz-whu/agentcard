import axios from "axios";
import { Config } from "../config";
import { getIdToken } from "../auth/AuthContext";

export const api = axios.create({ baseURL: Config.apiUrl });

api.interceptors.request.use((config) => {
  const token = getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
