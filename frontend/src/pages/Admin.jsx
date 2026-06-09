import {
  DollarSign,
  Edit,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Navbar from "../components/Navbar.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct
} from "../services/productService.js";

const CATEGORIES = [
  { value: "perifericos", label: "Periféricos" },
  { value: "audio", label: "Áudio" },
  { value: "monitores", label: "Monitores" },
  { value: "cameras", label: "Câmeras" },
  { value: "acessorios", label: "Acessórios" }
];

export default function Admin({ auth, onLogout }) {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("perifericos");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getAdminProducts();
      setProducts(data.produtos ?? []);
    } catch (err) {
      setError(err.message || "Erro ao carregar produtos.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenCreateForm() {
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setFormCategory("perifericos");
    setFormDesc("");
    setFormImage("");
    setFormErrors({});
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleOpenEditForm(product) {
    setEditingProduct(product);
    setFormName(product.nome);
    setFormPrice(product.preco);
    setFormCategory(product.categoria || "perifericos");
    setFormDesc(product.descricao || "");
    setFormImage(product.imagemUrl || "");
    setFormErrors({});
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function validateForm() {
    const errors = {};
    if (!formName.trim()) {
      errors.nome = "Nome é obrigatório.";
    }
    const priceNum = Number(formPrice);
    if (!formPrice || Number.isNaN(priceNum) || priceNum <= 0) {
      errors.preco = "Preço deve ser um número maior que zero.";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const payload = {
      nome: formName,
      preco: Number(formPrice),
      categoria: formCategory,
      descricao: formDesc,
      imagemUrl: formImage || `https://placehold.co/400x300/1E3A5F/ffffff?text=${encodeURIComponent(formName)}`
    };

    try {
      if (editingProduct) {
        // Edit mode (PUT)
        payload.id = editingProduct.id;
        const res = await updateProduct(payload);
        setSuccess("Produto atualizado com sucesso!");
        
        // Update local state
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.produto || { ...p, ...payload } : p))
        );
      } else {
        // Create mode (POST)
        const res = await createProduct(payload);
        setSuccess("Produto cadastrado com sucesso!");
        
        // Add to local state
        if (res.produto) {
          setProducts((prev) => [...prev, res.produto]);
        } else {
          fetchProducts(); // fallback if backend doesn't return created product
        }
      }
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Erro ao salvar produto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm("Deseja realmente excluir este produto?")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await deleteProduct(productId);
      setSuccess("Produto excluído com sucesso!");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      setError(err.message || "Erro ao deletar produto.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar auth={auth} compact onLogout={onLogout} />

      <div className="admin-layout" style={{ flex: 1 }}>
        <aside className="admin-sidebar">
          <p className="admin-sidebar-title">Navegação</p>
          <ul className="admin-nav">
            <li>
              <button
                className={`admin-nav-link ${currentSection === "dashboard" ? "active" : ""}`}
                onClick={() => {
                  setCurrentSection("dashboard");
                  setShowForm(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <a className={currentSection === "dashboard" ? "active" : ""}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </a>
              </button>
            </li>
            <li>
              <button
                className={`admin-nav-link ${currentSection === "produtos" ? "active" : ""}`}
                onClick={() => {
                  setCurrentSection("produtos");
                  setShowForm(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <a className={currentSection === "produtos" ? "active" : ""}>
                  <Package size={16} />
                  Produtos
                </a>
              </button>
            </li>
            <li>
              <button
                className={`admin-nav-link ${currentSection === "usuarios" ? "active" : ""}`}
                onClick={() => {
                  setCurrentSection("usuarios");
                  setShowForm(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <a className={currentSection === "usuarios" ? "active" : ""}>
                  <Users size={16} />
                  Usuários
                </a>
              </button>
            </li>
            <li>
              <button
                className={`admin-nav-link ${currentSection === "pedidos" ? "active" : ""}`}
                onClick={() => {
                  setCurrentSection("pedidos");
                  setShowForm(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <a className={currentSection === "pedidos" ? "active" : ""}>
                  <ShoppingCart size={16} />
                  Pedidos
                </a>
              </button>
            </li>
            <li style={{ marginTop: "2rem" }}>
              <button
                className="admin-nav-link"
                onClick={onLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <a>
                  <LogOut size={16} />
                  Sair
                </a>
              </button>
            </li>
          </ul>
        </aside>

        <main className="admin-main">
          {error && <StatusMessage type="error">{error}</StatusMessage>}
          {success && (
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                marginBottom: "1rem",
                fontSize: "0.88rem",
                fontWeight: "bold",
                border: "1px solid #c3e6cb"
              }}
            >
              {success}
            </div>
          )}

          {currentSection === "dashboard" && (
            <section>
              <div className="admin-header">
                <h1>Dashboard</h1>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Bem-vindo, {auth.usuario?.nome || "Administrador"}
                </span>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ color: "var(--primary)" }}>
                    <Package size={24} />
                  </div>
                  <div className="stat-label">Produtos</div>
                  <div className="stat-value">{isLoading ? "..." : products.length}</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ color: "var(--secondary)" }}>
                    <Users size={24} />
                  </div>
                  <div className="stat-label">Usuários</div>
                  <div className="stat-value">24</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ color: "var(--accent)" }}>
                    <ShoppingCart size={24} />
                  </div>
                  <div className="stat-label">Pedidos</div>
                  <div className="stat-value">12</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ color: "var(--success)" }}>
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-label">Receita</div>
                  <div className="stat-value">R$ 4.2k</div>
                </div>
              </div>
            </section>
          )}

          {currentSection === "produtos" && (
            <section>
              <div className="admin-header">
                <h1>Produtos</h1>
              </div>

              {!showForm ? (
                <div className="table-card">
                  <div className="table-card-header">
                    <h3>Lista de Produtos</h3>
                    <Button variant="accent" size="sm" onClick={handleOpenCreateForm}>
                      <Plus size={16} />
                      Novo Produto
                    </Button>
                  </div>
                  
                  <div style={{ overflowX: "auto" }}>
                    {isLoading ? (
                      <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
                        <LoaderCircle className="spin" size={32} />
                      </div>
                    ) : products.length === 0 ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                        Nenhum produto cadastrado.
                      </div>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id}>
                              <td>{p.id}</td>
                              <td style={{ fontWeight: "bold" }}>{p.nome}</td>
                              <td style={{ textTransform: "capitalize" }}>{p.categoria}</td>
                              <td>{formatCurrency(p.preco)}</td>
                              <td>
                                <span className="badge badge-success">Ativo</span>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => handleOpenEditForm(p)}
                                    type="button"
                                  >
                                    <Edit size={14} />
                                    Editar
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline"
                                    style={{
                                      borderColor: "var(--danger)",
                                      color: "var(--danger)"
                                    }}
                                    onClick={() => handleDelete(p.id)}
                                    type="button"
                                  >
                                    <Trash2 size={14} />
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ) : (
                <div className="admin-form-card">
                  <h3>{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
                  
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input
                          className={`form-input ${formErrors.nome ? "error" : ""}`}
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Nome do produto"
                          required
                        />
                        {formErrors.nome && (
                          <span className="form-error visible">{formErrors.nome}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Preço (R$) *</label>
                        <input
                          className={`form-input ${formErrors.preco ? "error" : ""}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="0.00"
                          required
                        />
                        {formErrors.preco && (
                          <span className="form-error visible">{formErrors.preco}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Categoria</label>
                        <select
                          className="form-input"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">URL da Imagem</label>
                        <input
                          className="form-input"
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://exemplo.com/imagem.png"
                        />
                      </div>

                      <div className="form-group full">
                        <label className="form-label">Descrição</label>
                        <input
                          className="form-input"
                          type="text"
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          placeholder="Descrição breve do produto"
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <LoaderCircle className="spin" size={14} />}
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {currentSection === "usuarios" && (
            <section>
              <div className="admin-header">
                <h1>Usuários</h1>
              </div>
              <div className="table-card">
                <div className="table-card-header">
                  <h3>Usuários Cadastrados</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Perfil</th>
                        <th>Cadastro</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td style={{ fontWeight: "bold" }}>Admin</td>
                        <td>admin@devshop.com</td>
                        <td>
                          <span className="badge badge-danger">ADMIN</span>
                        </td>
                        <td>01/01/2025</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td style={{ fontWeight: "bold" }}>João Silva</td>
                        <td>joao@email.com</td>
                        <td>
                          <span className="badge badge-success">CLIENTE</span>
                        </td>
                        <td>15/03/2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {currentSection === "pedidos" && (
            <section>
              <div className="admin-header">
                <h1>Pedidos</h1>
              </div>
              <div className="table-card">
                <div className="table-card-header">
                  <h3>Pedidos Recentes</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>001</td>
                        <td style={{ fontWeight: "bold" }}>João Silva</td>
                        <td>R$ 429,80</td>
                        <td>
                          <span className="badge badge-success">Entregue</span>
                        </td>
                        <td>20/04/2025</td>
                      </tr>
                      <tr>
                        <td>002</td>
                        <td style={{ fontWeight: "bold" }}>Maria Oliveira</td>
                        <td>R$ 899,90</td>
                        <td>
                          <span className="badge badge-warning">Em trânsito</span>
                        </td>
                        <td>28/04/2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
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
