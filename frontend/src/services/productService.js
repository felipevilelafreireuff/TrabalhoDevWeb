import { apiFetch } from "./apiClient.js";

export function getProducts(categoria = "todos") {
  const params = new URLSearchParams();

  if (categoria && categoria !== "todos") {
    params.set("categoria", categoria);
  }

  const query = params.toString();
  return apiFetch(`/index${query ? `?${query}` : ""}`);
}
