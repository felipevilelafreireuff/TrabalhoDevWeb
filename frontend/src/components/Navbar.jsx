import { LogIn, LogOut, Search, ShoppingCart, UserRound } from "lucide-react";
import Button from "./Button.jsx";

export default function Navbar({
  auth,
  compact = false,
  onNavigateHome,
  onNavigateLogin,
  onLogout
}) {
  return (
    <nav className="navbar">
      <div className="container">
        <button className="nav-logo nav-logo-button" onClick={onNavigateHome}>
          Dev<span>Shop</span>
        </button>

        {!compact ? (
          <div className="nav-search">
            <input type="search" placeholder="Buscar produtos..." />
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
          {!compact ? (
            <button className="icon-btn" aria-label="Carrinho">
              <ShoppingCart size={20} />
            </button>
          ) : null}
          {auth?.authenticated ? (
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut size={16} />
              Sair
            </Button>
          ) : (
            <Button size="sm" onClick={onNavigateLogin}>
              <LogIn size={16} />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
