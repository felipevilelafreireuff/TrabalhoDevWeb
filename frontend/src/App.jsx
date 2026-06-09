import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { getCurrentUser, logout } from "./services/authService.js";

export default function App() {
  const [page, setPage] = useState("home");
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    usuario: null
  });

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((data) => {
        if (!isMounted) return;
        setAuth({
          loading: false,
          authenticated: Boolean(data.authenticated),
          usuario: data.usuario ?? null
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setAuth({ loading: false, authenticated: false, usuario: null });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    await logout();
    setAuth({ loading: false, authenticated: false, usuario: null });
    setPage("home");
  }

  function handleLogin(usuario) {
    setAuth({ loading: false, authenticated: true, usuario });
    setPage("home");
  }

  if (page === "login") {
    return (
      <Login
        onNavigateHome={() => setPage("home")}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <Home
      auth={auth}
      onNavigateLogin={() => setPage("login")}
      onLogout={handleLogout}
    />
  );
}
