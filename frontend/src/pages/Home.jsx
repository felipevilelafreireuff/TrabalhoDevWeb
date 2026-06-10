import { LoaderCircle, PackageCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getProducts } from "../services/productService.js";

export default function Home({
  auth,
  onLogout,
  searchQuery,
  onSearchChange,
  cartItemsCount,
  onAddToCart,
  cartFeedback
}) {
  const [categoria, setCategoria] = useState("todos");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");

    getProducts(categoria)
      .then((data) => {
        if (!isMounted) return;
        setProducts(data.produtos ?? []);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setProducts([]);
        setError(requestError.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoria]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return products;
    }
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.nome.toLowerCase().includes(query) ||
        (product.descricao && product.descricao.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const heroProduct = useMemo(() => products[0], [products]);

  return (
    <>
      <Topbar auth={auth} />
      <Navbar
        auth={auth}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        cartItemsCount={cartItemsCount}
      />

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Frete gratis acima de R$ 500</span>
            <h1>
              Tecnologia que <em>inspira</em> o seu setup
            </h1>
            <p>
              Perifericos, monitores e acessorios premium para quem leva o
              desempenho a serio.
            </p>
            <div className="hero-actions">
              <a className="btn btn-accent" href="#produtos">
                Ver ofertas
              </a>
              {!auth.authenticated ? (
                <Link className="btn btn-ghostLight" to="/login">
                  Criar conta
                </Link>
              ) : null}
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">{products.length}+</div>
                <div className="hero-stat-label">Produtos</div>
              </div>
              <div>
                <div className="hero-stat-value">24h</div>
                <div className="hero-stat-label">Entrega</div>
              </div>
              <div>
                <div className="hero-stat-value">4.7</div>
                <div className="hero-stat-label">Avaliacao</div>
              </div>
            </div>
          </div>

          <aside className="hero-promo" aria-label="Destaque do dia">
            <p className="hero-promo-label">Destaque do dia</p>
            <div className="hero-promo-price">
              {heroProduct ? formatCurrency(heroProduct.preco) : "DevShop"}
            </div>
            <p className="hero-promo-name">
              {heroProduct?.nome || "Produtos para o seu setup"}
            </p>
          </aside>
        </div>
      </section>

      <main>
        <section className="section" id="produtos">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">Catalogo</p>
                <h2>Produtos em destaque</h2>
              </div>
              <span className="section-count">
                {isLoading ? "Carregando" : `${filteredProducts.length} produtos`}
              </span>
            </div>
            <hr className="section-divider" />

            <CategoryFilter
              currentCategory={categoria}
              onChange={(cat) => {
                setCategoria(cat);
                // Clear search when category changes for better UX
                if (onSearchChange) onSearchChange("");
              }}
            />

            <StatusMessage type="error">{error}</StatusMessage>
            <StatusMessage type="error">{cartFeedback}</StatusMessage>

            {isLoading ? (
              <div className="empty-state">
                <LoaderCircle className="spin" size={28} />
                <p>Buscando produtos na API...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <PackageCheck size={30} />
                <p>Nenhum produto encontrado para esta busca ou categoria.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Topbar({ auth }) {
  return (
    <div className="topbar">
      <div className="container">
        <span className="topbar-left">Frete gratis acima de R$ 500</span>
        <div className="topbar-right">
          {auth.loading ? (
            <span>Verificando sessao...</span>
          ) : auth.authenticated ? (
            <span>Ola, {auth.usuario?.nome || auth.usuario?.email}</span>
          ) : (
            <Link className="topbar-link" to="/login">
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

