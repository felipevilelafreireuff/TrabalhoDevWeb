// Dicionario de traducoes pt/en
const I18N = {
  pt: {
    'nav.home':           'Início',
    'nav.products':       'Produtos',
    'nav.admin':          'Admin',
    'nav.login':          'Entrar',
    'nav.search':         'Buscar produtos...',
    'hero.badge':         'Frete Grátis acima de R$ 500',
    'hero.title':         'Tecnologia que <em>inspira</em> o seu setup',
    'hero.sub':           'Periféricos, monitores e acessórios premium para quem leva o desempenho a sério.',
    'hero.cta':           'Ver Ofertas',
    'hero.signup':        'Criar Conta',
    'hero.promo.label':   'Destaque do Dia',
    'hero.promo.name':    'Monitor 24" Full HD',
    'products.title':     'Produtos em Destaque',
    'products.all':       'Ver todos',
    'filter.all':         'Todos',
    'filter.perifericos': 'Periféricos',
    'filter.audio':       'Áudio',
    'filter.monitores':   'Monitores',
    'filter.cameras':     'Câmeras',
    'filter.acessorios':  'Acessórios',
    'product.add':        'Adicionar',
    'product.added':      'Adicionado <i class="ph ph-check"></i>',
    'product.free':       'Frete grátis',
    'cart.title':         'Meu Carrinho',
    'cart.empty':         'Seu carrinho está vazio.',
    'cart.shop':          'Ver Produtos',
    'cart.subtotal':      'Subtotal',
    'cart.shipping':      'Frete',
    'cart.free':          'Grátis',
    'cart.total':         'Total',
    'cart.checkout':      'Finalizar Compra',
    'cart.continue':      'Continuar Comprando',
    'footer.academic':    'Projeto acadêmico — Desenvolvimento Web · 2025',
    'footer.team':        'Aloysio · Felipe · Jonathan · Ruan',
  },
  en: {
    'nav.home':           'Home',
    'nav.products':       'Products',
    'nav.admin':          'Admin',
    'nav.login':          'Sign In',
    'nav.search':         'Search products...',
    'hero.badge':         'Free Shipping over R$ 500',
    'hero.title':         'Technology that <em>inspires</em> your setup',
    'hero.sub':           'Premium peripherals, monitors and accessories for those who take performance seriously.',
    'hero.cta':           'Shop Now',
    'hero.signup':        'Create Account',
    'hero.promo.label':   'Deal of the Day',
    'hero.promo.name':    '24" Full HD Monitor',
    'products.title':     'Featured Products',
    'products.all':       'View all',
    'filter.all':         'All',
    'filter.perifericos': 'Peripherals',
    'filter.audio':       'Audio',
    'filter.monitores':   'Monitors',
    'filter.cameras':     'Cameras',
    'filter.acessorios':  'Accessories',
    'product.add':        'Add to Cart',
    'product.added':      'Added <i class="ph ph-check"></i>',
    'product.free':       'Free shipping',
    'cart.title':         'My Cart',
    'cart.empty':         'Your cart is empty.',
    'cart.shop':          'Shop Now',
    'cart.subtotal':      'Subtotal',
    'cart.shipping':      'Shipping',
    'cart.free':          'Free',
    'cart.total':         'Total',
    'cart.checkout':      'Checkout',
    'cart.continue':      'Continue Shopping',
    'footer.academic':    'Academic project — Web Development · 2025',
    'footer.team':        'Aloysio · Felipe · Jonathan · Ruan',
  },
};

// Controle de idioma com cookies
const Lang = {
  current: 'pt',

  t(key) { return I18N[this.current][key] ?? key; },

  apply(lang) {
    this.current = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[lang][key] !== undefined) el.innerHTML = I18N[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (I18N[lang][key] !== undefined) el.placeholder = I18N[lang][key];
    });
    const btn = document.querySelector('.lang-btn');
    if (btn) btn.textContent = lang === 'pt' ? 'EN' : 'PT';
    Cookies.set('devshop_lang', lang);
    // Re-renderiza conteúdo dinâmico
    if (document.getElementById('products-grid')) renderProducts(activeFilter);
    if (document.getElementById('cart-items'))    renderCart();
  },

  toggle() {
    this.apply(this.current === 'pt' ? 'en' : 'pt');
  },
};

let activeFilter = 'todos';

// Lista de produtos mockada (vai vir do banco depois)
// Virão do banco via Servlet/JSP quando o back-end estiver pronto
const PRODUCTS = [
  {
    id: 1, name: 'Teclado Mecânico RGB', nameen: 'Mechanical RGB Keyboard',
    category: 'perifericos', price: 299.90, oldPrice: 349.90,
    stars: 4.5, reviews: 128, badge: 'OFERTA', freeShip: true,
    img: 'https://placehold.co/400x300/1E3A5F/F4A261?text=Teclado+RGB',
    gradient: 'linear-gradient(135deg,#1E3A5F,#2E86AB)',
  },
  {
    id: 2, name: 'Headset Gamer 7.1', nameen: 'Gaming Headset 7.1',
    category: 'audio', price: 189.90, oldPrice: null,
    stars: 4.2, reviews: 87, badge: null, freeShip: false,
    img: 'https://placehold.co/400x300/2E86AB/ffffff?text=Headset+7.1',
    gradient: 'linear-gradient(135deg,#2E86AB,#48CAE4)',
  },
  {
    id: 3, name: 'Mouse Sem Fio Pro', nameen: 'Wireless Mouse Pro',
    category: 'perifericos', price: 129.90, oldPrice: null,
    stars: 4.7, reviews: 214, badge: 'NOVO', freeShip: false,
    img: 'https://placehold.co/400x300/1E3A5F/ffffff?text=Mouse+Pro',
    gradient: 'linear-gradient(135deg,#1E3A5F,#3D5A80)',
  },
  {
    id: 4, name: 'Monitor 24" Full HD', nameen: '24" Full HD Monitor',
    category: 'monitores', price: 899.90, oldPrice: 999.90,
    stars: 4.8, reviews: 56, badge: 'OFERTA', freeShip: true,
    img: 'https://placehold.co/400x300/F4A261/1E3A5F?text=Monitor+24%22',
    gradient: 'linear-gradient(135deg,#F4A261,#E76F51)',
  },
  {
    id: 5, name: 'Webcam HD 1080p', nameen: 'HD 1080p Webcam',
    category: 'cameras', price: 199.90, oldPrice: null,
    stars: 4.0, reviews: 43, badge: null, freeShip: false,
    img: 'https://placehold.co/400x300/2D6A4F/ffffff?text=Webcam+1080p',
    gradient: 'linear-gradient(135deg,#2D6A4F,#40916C)',
  },
  {
    id: 6, name: 'Hub USB-C 7 Portas', nameen: '7-Port USB-C Hub',
    category: 'acessorios', price: 89.90, oldPrice: null,
    stars: 4.3, reviews: 31, badge: null, freeShip: false,
    img: 'https://placehold.co/400x300/4A4E69/ffffff?text=Hub+USB-C',
    gradient: 'linear-gradient(135deg,#4A4E69,#9A8C98)',
  },
];

function productName(p) { return Lang.current === 'en' ? p.nameen : p.name; }

function starsHtml(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function installment(price) {
  const v = (price / 12).toFixed(2).replace('.', ',');
  return Lang.current === 'pt' ? `em 12x de R$&nbsp;${v}` : `12x of R$&nbsp;${v}`;
}

// Logica do carrinho usando localStorage (dps vai pra sessao)
const Cart = {
  items: JSON.parse(localStorage.getItem('devshop_cart') || '[]'),

  save() { localStorage.setItem('devshop_cart', JSON.stringify(this.items)); this.updateBadge(); },

  add(product) {
    const found = this.items.find(i => i.id === product.id);
    if (found) found.qty++;
    else this.items.push({ id: product.id, qty: 1 });
    this.save();
  },

  remove(id)      { this.items = this.items.filter(i => i.id !== id); this.save(); },

  updateQty(id, d) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += d;
    if (item.qty <= 0) this.remove(id); else this.save();
  },

  total()  { return this.items.reduce((s, i) => { const p = PRODUCTS.find(x => x.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0); },
  count()  { return this.items.reduce((s, i) => s + i.qty, 0); },

  updateBadge() {
    const b = document.querySelector('.cart-badge');
    if (!b) return;
    const n = this.count();
    b.textContent = n;
    b.style.display = n > 0 ? 'flex' : 'none';
  },
};

// Funcoes utilitarias para cookies
const Cookies = {
  set(name, val, days = 365) {
    const exp = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(val)};expires=${exp};path=/;SameSite=Lax`;
  },
  get(name) {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  },
};

// Troca de tema dark/light
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.querySelector('.theme-btn');
  if (btn) btn.innerHTML = theme === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
}
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  Cookies.set('devshop_theme', next);
}

// Notificacao toast
function showToast(msg, type = 'default') {
  let c = document.querySelector('.toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.cssText = 'opacity:0;transform:translateX(8px);transition:.25s ease'; setTimeout(() => t.remove(), 250); }, 2600);
}

// Efeito da navbar no scroll
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
}

// Animar elementos no scroll
function initFadeIn() {
  const obs = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// Renderiza os produtos na grid
function renderProducts(filter = 'todos') {
  activeFilter = filter;
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const list = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = list.map(p => `
    <article class="product-card fade-in" data-id="${p.id}">
      <div class="product-thumb">
        <img src="${p.img}" alt="${productName(p)}" loading="lazy">
        ${p.badge ? `<span class="product-badge-tag ${p.badge === 'NOVO' ? 'new' : ''}">${p.badge}</span>` : ''}
      </div>
      <div class="product-body">
        <p class="product-category">${Lang.t('filter.' + p.category)}</p>
        <h3 class="product-name">${productName(p)}</h3>
        <div class="product-stars">${starsHtml(p.stars)} <span>(${p.reviews})</span></div>
        <div class="product-price-wrap">
          ${p.oldPrice ? `<span class="product-old-price">R$&nbsp;${p.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
          <div class="product-price">R$&nbsp;${p.price.toFixed(2).replace('.', ',')}</div>
          <div class="product-installment">${installment(p.price)}</div>
          ${p.freeShip ? `<small style="color:var(--success);font-size:.72rem;font-weight:600">${Lang.t('product.free')}</small>` : ''}
        </div>
        <button class="add-cart-btn" onclick="addToCart(${p.id})">${Lang.t('product.add')}</button>
      </div>
    </article>
  `).join('');

  initFadeIn();
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  Cart.add(product);
  showToast(`"${productName(product)}" ${Lang.current === 'pt' ? 'adicionado!' : 'added!'}`, 'success');

  const btn = document.querySelector(`[data-id="${id}"] .add-cart-btn`);
  if (btn) {
    btn.textContent = Lang.t('product.added');
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = Lang.t('product.add'); btn.classList.remove('added'); }, 1800);
  }
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

// Monta o html do carrinho
function renderCart() {
  const container = document.getElementById('cart-items');
  const empty     = document.getElementById('cart-empty');
  const summary   = document.getElementById('cart-summary');
  if (!container) return;

  if (Cart.items.length === 0) {
    container.innerHTML = '';
    if (empty)   empty.style.display   = 'block';
    if (summary) summary.style.display = 'none';
    return;
  }

  if (empty)   empty.style.display   = 'none';
  if (summary) summary.style.display = 'block';

  container.innerHTML = Cart.items.map(ci => {
    const p = PRODUCTS.find(x => x.id === ci.id);
    if (!p) return '';
    return `
      <div class="cart-item" id="cart-item-${p.id}">
        <div class="cart-item-thumb">
          <img src="${p.img}" alt="${productName(p)}">
        </div>
        <div class="cart-item-info">
          <h3>${productName(p)}</h3>
          <p class="cat">${Lang.t('filter.' + p.category)}</p>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
            <span class="qty-value">${ci.qty}</span>
            <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">R$&nbsp;${(p.price * ci.qty).toFixed(2).replace('.', ',')}</span>
          <button class="btn btn-danger" onclick="removeFromCart(${p.id})">${Lang.current === 'pt' ? 'Remover' : 'Remove'}</button>
        </div>
      </div>`;
  }).join('');

  updateSummary();
}

function changeQty(id, d) { Cart.updateQty(id, d); renderCart(); }

function removeFromCart(id) {
  Cart.remove(id);
  renderCart();
  showToast(Lang.current === 'pt' ? 'Item removido.' : 'Item removed.', 'error');
}

function updateSummary() {
  const sub  = Cart.total();
  const ship = sub > 500 ? 0 : 19.90;
  const set  = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('summary-subtotal', `R$ ${sub.toFixed(2).replace('.', ',')}`);
  set('summary-shipping', ship === 0 ? Lang.t('cart.free') : `R$ ${ship.toFixed(2).replace('.', ',')}`);
  set('summary-total',    `R$ ${(sub + ship).toFixed(2).replace('.', ',')}`);
}

// Inicializacao quando a pagina carrega
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(Cookies.get('devshop_theme') || 'light');
  Lang.apply(Cookies.get('devshop_lang') || 'pt');
  initNavbar();
  Cart.updateBadge();

  if (document.getElementById('products-grid')) { renderProducts(); initFilters(); }
  if (document.getElementById('cart-items'))    { renderCart(); }

  initFadeIn();
});

