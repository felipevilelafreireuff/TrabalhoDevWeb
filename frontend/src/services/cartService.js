import { apiFetch } from "./apiClient.js";

export function getCart() {
  return apiFetch("/carrinho");
}

export function addToCart(productId, qty = 1) {
  return apiFetch("/carrinho", {
    method: "POST",
    body: JSON.stringify({ id: productId, qty })
  });
}

export function updateCartItem(productId, delta) {
  return apiFetch("/carrinho", {
    method: "PUT",
    body: JSON.stringify({ id: productId, delta })
  });
}

export function removeCartItem(productId) {
  return apiFetch("/carrinho", {
    method: "DELETE",
    body: JSON.stringify({ id: productId })
  });
}
