<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevShop — Painel Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
</head>
<body>

  <nav class="navbar">
    <div class="container">
      <a href="./" class="nav-logo">Dev<span>Shop</span></a>
      <div class="nav-actions">
        <button class="theme-btn" onclick="toggleTheme()" aria-label="Alternar tema"><i class="ph ph-moon"></i></button>
        <a href="./" class="btn btn-outline btn-sm">? Loja</a>
        <a href="login" class="btn btn-danger btn-sm">Sair</a>
      </div>
    </div>
  </nav>

  <div class="admin-layout">

    <aside class="admin-sidebar" aria-label="Menu administrativo">
      <p class="admin-sidebar-title">Menu</p>
      <ul class="admin-nav">
        <li><a href="#" class="active" onclick="showSection('dashboard',this);return false">?? Dashboard</a></li>
        <li><a href="#" onclick="showSection('produtos',this);return false"><i class="ph ph-package"></i> Produtos</a></li>
        <li><a href="#" onclick="showSection('usuarios',this);return false">?? Usuários</a></li>
        <li><a href="#" onclick="showSection('pedidos',this);return false"><i class="ph ph-shopping-cart"></i> Pedidos</a></li>
      </ul>
    </aside>

    <main class="admin-main">

      <!-- Dashboard -->
      <section id="section-dashboard">
        <div class="admin-header">
          <h1>Dashboard</h1>
          <span style="color:var(--text-muted);font-size:.85rem">Bem-vindo, Admin</span>
        </div>

        <div class="stats-grid">
          <div class="stat-card fade-in">
            <div class="stat-icon"><i class="ph ph-package"></i></div>
            <div class="stat-label">Produtos</div>
            <div class="stat-value">6</div>
          </div>
          <div class="stat-card fade-in">
            <div class="stat-icon">??</div>
            <div class="stat-label">Usuários</div>
            <div class="stat-value">24</div>
          </div>
          <div class="stat-card fade-in">
            <div class="stat-icon"><i class="ph ph-shopping-cart"></i></div>
            <div class="stat-label">Pedidos</div>
            <div class="stat-value">12</div>
          </div>
          <div class="stat-card fade-in">
            <div class="stat-icon">??</div>
            <div class="stat-label">Receita</div>
            <div class="stat-value">R$&nbsp;4.2k</div>
          </div>
        </div>
      </section>

      <!-- Produtos -->
      <section id="section-produtos" style="display:none">
        <div class="admin-header">
          <h1>Produtos</h1>
        </div>

        <div class="table-card fade-in">
          <div class="table-card-header">
            <h3>Lista de Produtos</h3>
            <button class="btn btn-accent btn-sm" onclick="toggleAddForm()">+ Novo Produto</button>
          </div>
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th>
                </tr>
              </thead>
              <tbody id="admin-products-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- Vai para /admin/produto (ProdutoServlet) -->
        <div class="admin-form-card fade-in" id="add-product-form" style="display:none">
          <h3>Novo Produto</h3>
          <form action="/admin/produto" method="POST" novalidate>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome</label>
                <input class="form-input" type="text" name="nome" placeholder="Nome do produto" required>
              </div>
              <div class="form-group">
                <label class="form-label">Preço (R$)</label>
                <input class="form-input" type="number" name="preco" step="0.01" min="0" placeholder="0,00" required>
              </div>
              <div class="form-group">
                <label class="form-label">Categoria</label>
                <select class="form-input" name="categoria">
                  <option value="perifericos">Periféricos</option>
                  <option value="audio">Áudio</option>
                  <option value="monitores">Monitores</option>
                  <option value="cameras">Câmeras</option>
                  <option value="acessorios">Acessórios</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Estoque</label>
                <input class="form-input" type="number" name="estoque" min="0" placeholder="0" required>
              </div>
              <div class="form-group full">
                <label class="form-label">Descrição</label>
                <input class="form-input" type="text" name="descricao" placeholder="Descrição breve">
              </div>
            </div>
            <div style="display:flex;gap:.75rem;margin-top:.5rem">
              <button type="submit" class="btn btn-primary">Salvar</button>
              <button type="button" class="btn btn-outline" onclick="toggleAddForm()">Cancelar</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Usuários -->
      <section id="section-usuarios" style="display:none">
        <div class="admin-header"><h1>Usuários</h1></div>
        <div class="table-card fade-in">
          <div class="table-card-header"><h3>Usuários Cadastrados</h3></div>
          <div style="overflow-x:auto">
            <table>
              <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Cadastro</th></tr></thead>
              <tbody>
                <tr>
                  <td>1</td><td>Admin</td><td>admin@devshop.com</td>
                  <td><span class="badge badge-danger">ADMIN</span></td><td>01/01/2025</td>
                </tr>
                <tr>
                  <td>2</td><td>João Silva</td><td>joao@email.com</td>
                  <td><span class="badge badge-success">CLIENTE</span></td><td>15/03/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Pedidos -->
      <section id="section-pedidos" style="display:none">
        <div class="admin-header"><h1>Pedidos</h1></div>
        <div class="table-card fade-in">
          <div class="table-card-header"><h3>Pedidos Recentes</h3></div>
          <div style="overflow-x:auto">
            <table>
              <thead><tr><th>#</th><th>Cliente</th><th>Total</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                <tr>
                  <td>001</td><td>João Silva</td><td>R$ 429,80</td>
                  <td><span class="badge badge-success">Entregue</span></td><td>20/04/2025</td>
                </tr>
                <tr>
                  <td>002</td><td>Maria Oliveira</td><td>R$ 899,90</td>
                  <td><span class="badge badge-warning">Em trânsito</span></td><td>28/04/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </main>
  </div>

  <script src="js/main.js"></script>
  <script>
    function showSection(name, link) {
      document.querySelectorAll('.admin-main > section').forEach(s => s.style.display = 'none');
      document.getElementById('section-' + name).style.display = 'block';
      document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      initFadeIn();
      if (name === 'produtos') renderAdminProducts();
    }

    function toggleAddForm() {
      const f = document.getElementById('add-product-form');
      f.style.display = f.style.display === 'none' ? 'block' : 'none';
    }

    function renderAdminProducts() {
      const tbody = document.getElementById('admin-products-tbody');
      if (!tbody) return;
      tbody.innerHTML = PRODUCTS.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.categoryLabel}</td>
          <td>R$&nbsp;${p.price.toFixed(2).replace('.', ',')}</td>
          <td><span class="badge badge-success">Ativo</span></td>
          <td style="display:flex;gap:.5rem;padding-top:.75rem">
            <button class="btn btn-sm btn-outline" onclick="showToast('Editar: ${p.name}')">Editar</button>
            <button class="btn btn-sm btn-danger"  onclick="showToast('Excluir requer confirmação.','error')">Excluir</button>
          </td>
        </tr>
      `).join('');
    }

    // Carrega produtos na primeira exibição
    document.addEventListener('DOMContentLoaded', renderAdminProducts);
  </script>
</body>
</html>

