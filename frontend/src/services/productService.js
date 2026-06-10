import { apiFetch } from "./apiClient.js";

const MOCK_PRODUCTS = [
  {
    id: 1,
    nome: "Mouse Gamer Sem Fio G Pro",
    preco: 649.90,
    categoria: "perifericos",
    descricao: "Sensor HERO 25K, design ultraleve de 63g e conexão Lightspeed.",
    imagemUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    nome: "Teclado Mecânico Keychron K2",
    preco: 799.00,
    categoria: "perifericos",
    descricao: "Layout compacto de 75%, switches Gateron Brown e conexão bluetooth.",
    imagemUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    nome: "Headset HyperX Cloud II",
    preco: 499.90,
    categoria: "audio",
    descricao: "Som surround 7.1 virtual, drivers de 53mm e espuma memory foam.",
    imagemUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    nome: "Monitor Gamer LG UltraGear 27\"",
    preco: 1299.00,
    categoria: "monitores",
    descricao: "Painel IPS, 144Hz, tempo de resposta de 1ms e suporte a HDR10.",
    imagemUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    nome: "Webcam Logitech C920s Pro",
    preco: 399.00,
    categoria: "cameras",
    descricao: "Gravação em Full HD 1080p a 30fps com tampa de privacidade.",
    imagemUrl: "https://images.unsplash.com/photo-1603184017905-b416284d262d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    nome: "Suporte de Monitor Articulado",
    preco: 219.00,
    categoria: "acessorios",
    descricao: "Pistão a gás com rotação 360° para telas de 17 a 35 polegadas.",
    imagemUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop&q=60"
  }
];

export async function getProducts(categoria = "todos") {
  const params = new URLSearchParams();

  if (categoria && categoria !== "todos") {
    params.set("categoria", categoria);
  }

  const query = params.toString();
  
  try {
    const data = await apiFetch(`/index${query ? `?${query}` : ""}`);
    if (data && data.produtos) {
      return data;
    }
  } catch (error) {
    console.warn("API de backend offline. Carregando dados locais de simulação (Mock)...", error);
  }

  // Fallback para exibir produtos quando a API não estiver acessível (como no GitHub Pages sem backend nuvem)
  const filtered = categoria === "todos"
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.categoria === categoria);

  return { produtos: filtered };
}
