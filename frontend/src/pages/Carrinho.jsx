import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

export default function Carrinho({
  auth,
  onLogout,
  cartItems,
  onUpdateQuantity,
  onRemoveItem
}) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.preco) * item.quantity,
    0
  );
  
  // Shipping: R$ 19,90. Free for orders above R$ 500. Free if empty.
  const isShippingFree = subtotal >= 500;
  const shippingCost = cartItems.length === 0 || isShippingFree ? 0 : 19.9;
  const total = subtotal + shippingCost;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar auth={auth} />
      <Navbar auth={auth} onLogout={onLogout} compact={false} />

      <main className="section" style={{ flex: 1 }}>
        <div className="container">
          <div className="cart-layout">
            <div>
              <h2 className="cart-section-title">Meu Carrinho</h2>

              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} style={{ marginBottom: "1rem", color: "var(--text-muted)" }} />
                  <p>Seu carrinho está vazio.</p>
                  <Link to="/" className="btn btn-primary">
                    Ver Produtos
                  </Link>
                </div>
              ) : (
                <div id="cart-items">
                  {cartItems.map((item) => (
                    <article key={item.product.id} className="cart-item">
                      <div className="cart-item-thumb">
                        <img
                          src={item.product.imagemUrl}
                          alt={item.product.nome}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-product.svg";
                          }}
                        />
                      </div>
                      
                      <div className="cart-item-info">
                        <h3>{item.product.nome}</h3>
                        <p className="cat">{item.product.categoria}</p>
                        
                        <div className="qty-control">
                          <button
                            className="qty-btn"
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-right">
                        <div className="cart-item-price">
                          {formatCurrency(Number(item.product.preco) * item.quantity)}
                        </div>
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{
                            border: "none",
                            color: "var(--danger)",
                            padding: "0.25rem",
                            minHeight: "auto"
                          }}
                          onClick={() => onRemoveItem(item.product.id)}
                          type="button"
                          aria-label="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <aside>
                <div className="cart-summary">
                  <h3 className="cart-summary-title">Resumo</h3>
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Frete</span>
                    <span>
                      {isShippingFree ? (
                        <span style={{ color: "var(--success)", fontWeight: "bold" }}>
                          Grátis
                        </span>
                      ) : (
                        formatCurrency(shippingCost)
                      )}
                    </span>
                  </div>
                  
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <Button
                    variant="accent"
                    onClick={() => alert("Compra finalizada! (Simulação)")}
                    fullWidth
                  >
                    Finalizar Compra
                  </Button>

                  <Link
                    to="/"
                    className="btn btn-ghost"
                    style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
                  >
                    <ArrowLeft size={16} />
                    Continuar Comprando
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Topbar({ auth }) {
  return (
    <div className="topbar">
      <div className="container">
        <span className="topbar-left">Frete grátis acima de R$ 500</span>
        <div className="topbar-right">
          {auth.loading ? (
            <span>Verificando sessão...</span>
          ) : auth.authenticated ? (
            <span>Olá, {auth.usuario?.nome || auth.usuario?.email}</span>
          ) : (
            <Link to="/login" className="topbar-link">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  const price = Number(value);
  if (Number.isNaN(price)) {
    return "R$ --";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(price);
}
