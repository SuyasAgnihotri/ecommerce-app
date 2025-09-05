import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => {
    const raw = localStorage.getItem("tokens");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (tokens) localStorage.setItem("tokens", JSON.stringify(tokens));
    else localStorage.removeItem("tokens");
  }, [tokens]);

  const isAuthenticated = !!tokens?.access;

  const logout = () => setTokens(null);

  const value = useMemo(
    () => ({ tokens, setTokens, isAuthenticated, logout }),
    [tokens, isAuthenticated]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
