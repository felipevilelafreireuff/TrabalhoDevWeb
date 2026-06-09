import { LogIn, LogOut, Search, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function Navbar({
  auth,
  compact = false,
  onLogout,
  searchQuery = "",
  onSearchChange,
  cartItemsCount = 0
}) {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo nav-logo-button">
          Dev<span>Shop</span>
        </Link>

        {!compact ? (
          <div className="nav-search">
            <input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
            <button aria-label="Buscar">
              <Search size={18} />
            </button>
          </div>
        ) : null}

        <div className="nav-actions">
          {!compact && auth?.authenticated ? (
            <span className="user-pill">
              <UserRound size={16} />
              {auth.usuario?.nome || auth.usuario?.email}
            </span>
          ) : null}

          {!compact && auth?.authenticated && auth.usuario?.papel === "ADMIN" ? (
            <Link to="/admin" className="btn btn-sm btn-ghost" style={{ marginRight: "0.25rem" }}>
              Admin
            </Link>
          ) : null}

          {!compact ? (
            <Link to="/carrinho" className="icon-btn" aria-label="Carrinho" style={{ position: "relative" }}>
              <ShoppingCart size={20} />
              {cartItemsCount > 0 ? (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "var(--accent)",
                    color: "var(--primary)",
                    borderRadius: "50%",
                    padding: "2px 5px",
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    lineHeight: 1,
                    minWidth: "16px",
                    textAlign: "center"
                  }}
                >
                  {cartItemsCount}
                </span>
              ) : null}
            </Link>
          ) : null}

          {auth?.authenticated ? (
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut size={16} />
              Sair
            </Button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <LogIn size={16} />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

