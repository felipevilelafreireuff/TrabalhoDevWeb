import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { HashRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Carrinho from "./pages/Carrinho.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem
} from "./services/cartService.js";
import { getCurrentUser, logout } from "./services/authService.js";

export default function App() {
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    usuario: null
  });
  const [cartItems, setCartItems] = useState([]);
  const [cartFeedback, setCartFeedback] = useState("");
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

  useEffect(() => {
    let isMounted = true;

    getCart()
      .then((data) => {
        if (!isMounted) return;
        setCartItems(normalizeCartItems(data.items));
      })
      .catch(() => {
        if (!isMounted) return;
        setCartItems([]);
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

  async function handleAddToCart(product) {
    setCartFeedback("");
    try {
      const data = await addToCart(product.id);
      setCartItems(normalizeCartItems(data.items));
    } catch (err) {
      setCartFeedback(err.message || "Nao foi possivel adicionar ao carrinho.");
    }
  }

  async function handleUpdateQuantity(productId, delta) {
    setCartFeedback("");
    try {
      const data = await updateCartItem(productId, delta);
      setCartItems(normalizeCartItems(data.items));
    } catch (err) {
      setCartFeedback(err.message || "Nao foi possivel atualizar o carrinho.");
    }
  }

  async function handleRemoveItem(productId) {
    setCartFeedback("");
    try {
      const data = await removeCartItem(productId);
      setCartItems(normalizeCartItems(data.items));
    } catch (err) {
      setCartFeedback(err.message || "Nao foi possivel remover o item.");
    }
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
              cartFeedback={cartFeedback}
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
              cartFeedback={cartFeedback}
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

function normalizeCartItems(items = []) {
  return items.map((item) => ({
    product: {
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      preco: item.preco,
      categoria: item.categoria,
      imagemUrl: item.imagemUrl
    },
    quantity: item.qty
  }));
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

