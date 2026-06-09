import { apiFetch } from "./apiClient.js";

export function getProducts(categoria = "todos") {
  const params = new URLSearchParams();

  if (categoria && categoria !== "todos") {
    params.set("categoria", categoria);
  }

  const query = params.toString();
  return apiFetch(`/index${query ? `?${query}` : ""}`);
}

export function getAdminProducts() {
  return apiFetch("/admin");
}

export function createProduct(product) {
  return apiFetch("/admin", {
    method: "POST",
    body: JSON.stringify(product)
  });
}

export function updateProduct(product) {
  return apiFetch("/admin", {
    method: "PUT",
    body: JSON.stringify(product)
  });
}

export function deleteProduct(productId) {
  return apiFetch("/admin", {
    method: "DELETE",
    body: JSON.stringify({ id: productId })
  });
}

