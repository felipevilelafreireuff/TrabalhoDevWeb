<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevShop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
</head>
<body>

  <div class="topbar">
    <div class="container">
      <span class="topbar-left"><i class="ph ph-package"></i> <span data-i18n="hero.badge">Frete Grátis acima de R$ 500</span></span>
      <div class="topbar-right">
        <a href="login" data-i18n="nav.login">Entrar</a>
        <span>|</span>
        <a href="login">Cadastrar</a>
      </div>
    </div>
  </div>

  <nav class="navbar">
    <div class="container">
      <a href="./" class="nav-logo">Dev<span>Shop</span></a>

      <div class="nav-search">
        <input type="search" data-i18n-placeholder="nav.search" placeholder="Buscar produtos...">
        <button aria-label="Buscar"><i class="ph ph-magnifying-glass"></i></button>
      </div>

      <div class="nav-actions">
        <button class="lang-btn" onclick="Lang.toggle()">EN</button>
        <button class="icon-btn theme-btn" onclick="toggleTheme()" aria-label="Tema"><i class="ph ph-moon"></i></button>
        <a href="carrinho" class="icon-btn" aria-label="Carrinho">
          <i class="ph ph-shopping-cart"></i>
          <span class="cart-badge" style="display:none">0</span>
        </a>
        <a href="login" class="btn btn-primary btn-sm" data-i18n="nav.login">Entrar</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span class="hero-badge" data-i18n="hero.badge">Frete Grátis acima de R$ 500</span>
        <h1 data-i18n="hero.title">Tecnologia que <em>inspira</em> o seu setup</h1>
        <p data-i18n="hero.sub">Periféricos, monitores e acessórios premium para quem leva o desempenho a sério.</p>
        <div class="hero-actions">
          <a href="#produtos" class="btn btn-accent" data-i18n="hero.cta">Ver Ofertas</a>
          <a href="login" class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.3)" data-i18n="hero.signup">Criar Conta</a>
        </div>
        <div class="hero-stats">
          <div>
            <div class="hero-stat-value">6+</div>
            <div class="hero-stat-label" data-i18n="filter.all">Produtos</div>
          </div>
          <div>
            <div class="hero-stat-value">24h</div>
            <div class="hero-stat-label">Entrega</div>
          </div>
          <div>
            <div class="hero-stat-value">4.7★</div>
            <div class="hero-stat-label">Avaliação</div>
          </div>
        </div>
      </div>

      <div class="hero-promo">
        <p class="hero-promo-label" data-i18n="hero.promo.label">Destaque do Dia</p>
        <div class="hero-promo-price">R$ 899,90</div>
        <p class="hero-promo-name" data-i18n="hero.promo.name">Monitor 24" Full HD</p>
        <div class="hero-promo-cta">
          <button class="btn btn-accent btn-sm" onclick="addToCart(4)" data-i18n="hero.cta">Ver Oferta</button>
        </div>
      </div>
    </div>
  </section>

  <main>
    <section class="section" id="produtos">
      <div class="container">
        <div class="section-header fade-in">
          <h2 data-i18n="products.title">Produtos em Destaque</h2>
          <a href="#" style="font-size:.85rem;font-weight:600" data-i18n="products.all">Ver todos</a>
        </div>
        <hr class="section-divider">

        <div class="filters fade-in">
          <button class="filter-btn active" data-filter="todos" data-i18n="filter.all">Todos</button>
          <button class="filter-btn" data-filter="perifericos" data-i18n="filter.perifericos">Periféricos</button>
          <button class="filter-btn" data-filter="audio" data-i18n="filter.audio">Áudio</button>
          <button class="filter-btn" data-filter="monitores" data-i18n="filter.monitores">Monitores</button>
          <button class="filter-btn" data-filter="cameras" data-i18n="filter.cameras">Câmeras</button>
          <button class="filter-btn" data-filter="acessorios" data-i18n="filter.acessorios">Acessórios</button>
        </div>

        <div class="products-grid" id="products-grid">
          <c:forEach var="p" items="${produtos}">
            <article class="product-card fade-in" data-id="${p.id}">
              <div class="product-thumb">
                <img src="<c:out value='${p.imagemUrl}'/>" alt="<c:out value='${p.nome}'/>" loading="lazy">
              </div>
              <div class="product-body">
                <p class="product-category"><c:out value="${p.categoria}"/></p>
                <h3 class="product-name"><c:out value="${p.nome}"/></h3>
                <div class="product-stars">★★★★☆ <span>(10)</span></div>
                <div class="product-price-wrap">
                  <div class="product-price">R$ <c:out value="${p.preco}"/></div>
                </div>
                <form action="carrinho" method="post">
                  <input type="hidden" name="acao" value="adicionar">
                  <input type="hidden" name="idProduto" value="${p.id}">
                  <button type="submit" class="add-cart-btn">Adicionar</button>
                </form>
              </div>
            </article>
          </c:forEach>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-inner">
        <span class="footer-logo">Dev<span>Shop</span></span>
        <p data-i18n="footer.academic">Projeto acadêmico — Desenvolvimento Web · 2025</p>
        <p data-i18n="footer.team">Aloysio · Felipe · Jonathan · Ruan</p>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script>
    function filterCategory(cat, el) {
      window.location.href = "?categoria=" + cat;
    }
  </script>
</body>
</html>
