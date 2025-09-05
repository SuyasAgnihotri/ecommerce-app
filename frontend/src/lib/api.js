import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export function createApiClient(getAccessToken, setTokens) {
  const client = axios.create({ baseURL: API_BASE });
  client.interceptors.request.use((config) => {
    const token = getAccessToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry && setTokens) {
        original._retry = true;
        const tokensRaw = localStorage.getItem("tokens");
        const tokens = tokensRaw ? JSON.parse(tokensRaw) : null;
        if (tokens?.refresh) {
          try {
            const rf = await axios.post(`${API_BASE}/auth/token/refresh/`, {
              refresh: tokens.refresh,
            });
            const newTokens = { ...tokens, access: rf.data.access };
            localStorage.setItem("tokens", JSON.stringify(newTokens));
            setTokens(newTokens);
            original.headers.Authorization = `Bearer ${newTokens.access}`;
            return client(original);
          } catch (_) {
            localStorage.removeItem("tokens");
            setTokens(null);
          }
        }
      }
      return Promise.reject(error);
    }
  );
  return client;
}
