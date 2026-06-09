import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { HashRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Carrinho from "./pages/Carrinho.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { getCurrentUser, logout } from "./services/authService.js";

export default function App() {
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    usuario: null
  });
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
  }

  function handleLogin(usuario) {
    setAuth({ loading: false, authenticated: true, usuario });
  }

  function handleAddToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function handleUpdateQuantity(productId, delta) {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemoveItem(productId) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              auth={auth}
              onLogout={handleLogout}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cartItemsCount={cartItemsCount}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/login"
          element={
            auth.authenticated ? (
              auth.usuario?.papel === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <LoginWrapper onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/carrinho"
          element={
            <Carrinho
              auth={auth}
              onLogout={handleLogout}
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute auth={auth}>
              <Admin auth={auth} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();
  return (
    <Login
      onLogin={(usuario) => {
        onLogin(usuario);
        if (usuario?.papel === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }}
      onNavigateHome={() => navigate("/")}
    />
  );
}

function ProtectedRoute({ auth, children }) {
  if (auth.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <LoaderCircle className="spin" size={32} />
        <span style={{ marginLeft: "0.5rem" }}>Verificando sessão...</span>
      </div>
    );
  }

  if (!auth.authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.usuario?.papel !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

