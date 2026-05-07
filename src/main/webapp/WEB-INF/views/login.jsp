<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevShop — Entrar / Cadastrar</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
</head>
<body>

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
      </div>
    </div>
  </nav>

  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <a href="./">Dev<span>Shop</span></a>
      </div>

      <div class="auth-tabs" role="tablist">
        <button class="auth-tab active" data-target="form-login" role="tab" data-i18n="login.tab.in">Entrar</button>
        <button class="auth-tab" data-target="form-cadastro" role="tab" data-i18n="login.tab.up">Cadastrar</button>
      </div>

      <form id="form-login" class="auth-form active" action="login" method="POST" novalidate>
        <c:if test="${not empty erro}">
          <div style="color: var(--error); background: #ffe6e6; padding: 10px; border-radius: 4px; margin-bottom: 15px; text-align: center; font-weight: 500;">
            <c:out value="${erro}"/>
          </div>
        </c:if>
        <div class="form-group">
          <label class="form-label" for="login-email">E-mail</label>
          <input class="form-input" type="email" id="login-email" name="email"
                 placeholder="seu@email.com" autocomplete="email">
          <span class="form-error" id="login-email-error" role="alert"></span>
        </div>
        <div class="form-group">
          <label class="form-label" for="login-pass">Senha</label>
          <input class="form-input" type="password" id="login-pass" name="senha"
                 placeholder="••••••••" autocomplete="current-password">
          <span class="form-error" id="login-pass-error" role="alert"></span>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:.5rem">
          Entrar
        </button>
        <p class="form-footer"><a href="#">Esqueceu sua senha?</a></p>
      </form>

      <!-- POST /cadastro → CadastroServlet -->
      <form id="form-cadastro" class="auth-form" action="/cadastro" method="POST" novalidate>
        <div class="form-group">
          <label class="form-label" for="cad-nome">Nome completo</label>
          <input class="form-input" type="text" id="cad-nome" name="nome"
                 placeholder="João Silva" autocomplete="name">
          <span class="form-error" id="cad-nome-error" role="alert"></span>
        </div>
        <div class="form-group">
          <label class="form-label" for="cad-email">E-mail</label>
          <input class="form-input" type="email" id="cad-email" name="email"
                 placeholder="seu@email.com" autocomplete="email">
          <span class="form-error" id="cad-email-error" role="alert"></span>
        </div>
        <div class="form-group">
          <label class="form-label" for="cad-pass">Senha</label>
          <input class="form-input" type="password" id="cad-pass" name="senha"
                 placeholder="Mín. 8 caracteres" autocomplete="new-password">
          <div class="strength-bar" aria-hidden="true"><div class="strength-fill" id="strength-fill"></div></div>
          <span class="form-error" id="cad-pass-error" role="alert"></span>
        </div>
        <div class="form-group">
          <label class="form-label" for="cad-confirm">Confirmar senha</label>
          <input class="form-input" type="password" id="cad-confirm" name="confirmar"
                 placeholder="Repita a senha" autocomplete="new-password">
          <span class="form-error" id="cad-confirm-error" role="alert"></span>
        </div>
        <button type="submit" class="btn btn-accent" style="width:100%;justify-content:center;margin-top:.5rem">
          Criar Conta
        </button>
        <p class="form-footer">
          Já tem conta?
          <a href="#" onclick="document.querySelector('[data-target=form-login]').click();return false">Entrar</a>
        </p>
      </form>
    </div>
  </div>

  <script src="js/main.js"></script>
  <script src="js/validacao.js"></script>
</body>
</html>

