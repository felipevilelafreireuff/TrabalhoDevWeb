const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await readJson(response);

  if (!response.ok) {
    const message = data?.message || "Nao foi possivel concluir a requisicao.";
    throw new Error(message);
  }

  return data;
}

async function readJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
