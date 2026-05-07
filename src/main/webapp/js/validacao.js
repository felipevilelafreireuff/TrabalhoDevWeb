// funcoes auxiliares
function validateEmail(v)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function validatePassword(v) { return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(v); }

function passwordStrength(v) {
  let s = 0;
  if (v.length >= 8)            s++;
  if (/[A-Z]/.test(v))          s++;
  if (/\d/.test(v))             s++;
  if (/[^A-Za-z0-9]/.test(v))  s++;
  return s; // 0–4
}

function showError(input, errorEl, msg) {
  input.classList.add('error');
  input.classList.remove('success');
  errorEl.textContent = msg;
  errorEl.classList.add('visible');
}

function clearError(input, errorEl) {
  input.classList.remove('error');
  input.classList.add('success');
  errorEl.classList.remove('visible');
}

// controle das abas login/cadastro
function initAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab, .auth-form').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}

// validacao login
function initLoginForm() {
  const form = document.getElementById('form-login');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const emailError = document.getElementById('login-email-error');
  const passInput  = document.getElementById('login-pass');
  const passError  = document.getElementById('login-pass-error');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Digite um e-mail válido.'); ok = false;
    } else { clearError(emailInput, emailError); }

    if (passInput.value.length < 6) {
      showError(passInput, passError, 'Senha muito curta.'); ok = false;
    } else { clearError(passInput, passError); }

    if (ok) {
      showToast('Entrando...', 'success');
      form.submit();
    }
  });
}

// validacao do cadastro
function initRegisterForm() {
  const form = document.getElementById('form-cadastro');
  if (!form) return;

  const fields = {
    nome:    { input: document.getElementById('cad-nome'),    error: document.getElementById('cad-nome-error') },
    email:   { input: document.getElementById('cad-email'),   error: document.getElementById('cad-email-error') },
    pass:    { input: document.getElementById('cad-pass'),    error: document.getElementById('cad-pass-error') },
    confirm: { input: document.getElementById('cad-confirm'), error: document.getElementById('cad-confirm-error') },
  };
  const strengthFill = document.getElementById('strength-fill');

  // Barra de força da senha em tempo real
  fields.pass.input.addEventListener('input', () => {
    const s = passwordStrength(fields.pass.input.value);
    const colors = ['', '#C1121F', '#F4A261', '#2E86AB', '#2D6A4F'];
    const widths  = ['0%', '25%', '50%', '75%', '100%'];
    if (strengthFill) {
      strengthFill.style.width      = widths[s];
      strengthFill.style.background = colors[s] || 'var(--border)';
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    if (fields.nome.input.value.trim().length < 3) {
      showError(fields.nome.input, fields.nome.error, 'Nome deve ter pelo menos 3 caracteres.'); ok = false;
    } else { clearError(fields.nome.input, fields.nome.error); }

    if (!validateEmail(fields.email.input.value)) {
      showError(fields.email.input, fields.email.error, 'Digite um e-mail válido.'); ok = false;
    } else { clearError(fields.email.input, fields.email.error); }

    if (!validatePassword(fields.pass.input.value)) {
      showError(fields.pass.input, fields.pass.error, 'Mínimo 8 caracteres, 1 maiúscula e 1 número.'); ok = false;
    } else { clearError(fields.pass.input, fields.pass.error); }

    if (fields.pass.input.value !== fields.confirm.input.value) {
      showError(fields.confirm.input, fields.confirm.error, 'As senhas não coincidem.'); ok = false;
    } else { clearError(fields.confirm.input, fields.confirm.error); }

    if (ok) {
      showToast('Conta criada com sucesso!', 'success');
      form.submit();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthTabs();
  initLoginForm();
  initRegisterForm();
});
