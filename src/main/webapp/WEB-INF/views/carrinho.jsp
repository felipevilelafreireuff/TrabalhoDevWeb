<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevShop — Carrinho</title>
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

  <main class="section">
    <div class="container">
      <div class="cart-layout">

        <div>
          <h2 class="cart-section-title" data-i18n="cart.title">Meu Carrinho</h2>

          <div id="cart-empty" class="cart-empty" style="display:none">
            <p data-i18n="cart.empty">Seu carrinho está vazio.</p>
            <a href="./" class="btn btn-primary" data-i18n="cart.shop">Ver Produtos</a>
          </div>

          <div id="cart-items"></div>
        </div>

        <!-- Resumo — dados virão do HttpSession quando o back-end estiver pronto -->
        <aside id="cart-summary" style="display:none">
          <div class="cart-summary">
            <h3 class="cart-summary-title">Resumo</h3>
            <div class="summary-row">
              <span data-i18n="cart.subtotal">Subtotal</span>
              <span id="summary-subtotal">R$ 0,00</span>
            </div>
            <div class="summary-row">
              <span data-i18n="cart.shipping">Frete</span>
              <span id="summary-shipping">R$ 19,90</span>
            </div>
            <div class="summary-row total">
              <span data-i18n="cart.total">Total</span>
              <span id="summary-total">R$ 0,00</span>
            </div>
            <button class="btn btn-accent" onclick="showToast('Faça login para finalizar.','error')" data-i18n="cart.checkout">
              Finalizar Compra
            </button>
            <a href="./" class="btn btn-ghost" style="width:100%;justify-content:center" data-i18n="cart.continue">
              Continuar Comprando
            </a>
          </div>
        </aside>

      </div>
    </div>
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
</body>
</html>

