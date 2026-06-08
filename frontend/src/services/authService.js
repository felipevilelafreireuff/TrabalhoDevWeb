import { apiFetch } from "./apiClient.js";

export function login(email, senha) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha })
  });
}

export function getCurrentUser() {
  return apiFetch("/login");
}

export function logout() {
  return apiFetch("/logout", { method: "POST" });
}
