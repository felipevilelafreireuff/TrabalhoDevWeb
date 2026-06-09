import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useState } from "react";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Navbar from "../components/Navbar.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { login } from "../services/authService.js";

export default function Login({ onLogin, onNavigateHome }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    const validationErrors = validateForm({ email, senha });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await login(email, senha);
      onLogin(data.usuario);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar compact onNavigateHome={onNavigateHome} />
      <main className="auth-page">
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-logo">
            <button className="brand-button" onClick={onNavigateHome}>
              Dev<span>Shop</span>
            </button>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Autenticacao">
            <button className="auth-tab active" type="button">
              Entrar
            </button>
            <button className="auth-tab" disabled type="button">
              Cadastrar
            </button>
          </div>

          <form className="auth-form active" onSubmit={handleSubmit} noValidate>
            <h1 className="sr-only" id="login-title">
              Entrar na DevShop
            </h1>
            <StatusMessage type="error">{feedback}</StatusMessage>

            <Input
              autoComplete="email"
              error={errors.email}
              id="login-email"
              label="E-mail"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              type="email"
              value={email}
            />

            <Input
              autoComplete="current-password"
              error={errors.senha}
              id="login-senha"
              label="Senha"
              onChange={(event) => setSenha(event.target.value)}
              placeholder="********"
              type="password"
              value={senha}
            />

            <Button disabled={isSubmitting} fullWidth type="submit">
              {isSubmitting ? <LoaderCircle className="spin" size={16} /> : null}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>

            <p className="form-footer">
              <button className="link-button" onClick={onNavigateHome} type="button">
                <ArrowLeft size={14} />
                Voltar para a loja
              </button>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}

function validateForm({ email, senha }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Informe um e-mail valido.";
  }

  if (!senha.trim()) {
    errors.senha = "Informe sua senha.";
  }

  return errors;
}
