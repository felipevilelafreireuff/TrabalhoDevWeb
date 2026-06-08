package com.devshop.controller;

import com.devshop.model.bean.Produto;
import com.devshop.model.dao.ProdutoDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/carrinho")
public class CarrinhoServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private ProdutoDAO produtoDAO;

    @Override
    public void init() {
        produtoDAO = new ProdutoDAO();
    }

    @SuppressWarnings("unchecked")
    private Map<Integer, Integer> getCartFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        Map<Integer, Integer> cart = (Map<Integer, Integer>) session.getAttribute("carrinho");
        if (cart == null) {
            cart = new LinkedHashMap<>(); // Mantém a ordem de inserção dos itens no carrinho
            session.setAttribute("carrinho", cart);
        }
        return cart;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        if (isJsonRequest(request) || "true".equals(request.getParameter("json"))) {
            sendCartResponse(request, response);
            return;
        }
        
        request.getRequestDispatcher("/WEB-INF/views/carrinho.jsp").forward(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        
        if (!isJsonRequest(request)) {
            writeJson(response, HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, Map.of(
                    "success", false,
                    "message", "Content-Type ou Accept deve ser application/json."
            ));
            return;
        }

        try {
            JsonObject json = gson.fromJson(request.getReader(), JsonObject.class);
            if (json == null || !json.has("id") || json.get("id").isJsonNull()) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", "ID do produto é obrigatório."
                ));
                return;
            }

            int produtoId = json.get("id").getAsInt();
            int qty = 1;
            if (json.has("qty") && !json.get("qty").isJsonNull()) {
                qty = json.get("qty").getAsInt();
            }

            Produto produto = produtoDAO.buscarPorId(produtoId);
            if (produto == null) {
                writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of(
                        "success", false,
                        "message", "Produto não encontrado."
                ));
                return;
            }

            Map<Integer, Integer> cart = getCartFromSession(request);
            cart.put(produtoId, cart.getOrDefault(produtoId, 0) + qty);

            sendCartResponse(request, response);
        } catch (JsonSyntaxException e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "JSON malformatado."
            ));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        
        if (!isJsonRequest(request)) {
            writeJson(response, HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, Map.of(
                    "success", false,
                    "message", "Content-Type ou Accept deve ser application/json."
            ));
            return;
        }

        try {
            JsonObject json = gson.fromJson(request.getReader(), JsonObject.class);
            if (json == null || !json.has("id") || json.get("id").isJsonNull()) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", "ID do produto é obrigatório."
                ));
                return;
            }

            int produtoId = json.get("id").getAsInt();
            Map<Integer, Integer> cart = getCartFromSession(request);

            if (!cart.containsKey(produtoId)) {
                writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of(
                        "success", false,
                        "message", "Produto não está no carrinho."
                ));
                return;
            }

            if (json.has("qty") && !json.get("qty").isJsonNull()) {
                int qty = json.get("qty").getAsInt();
                if (qty <= 0) {
                    cart.remove(produtoId);
                } else {
                    cart.put(produtoId, qty);
                }
            } else if (json.has("delta") && !json.get("delta").isJsonNull()) {
                int delta = json.get("delta").getAsInt();
                int currentQty = cart.get(produtoId);
                int newQty = currentQty + delta;
                if (newQty <= 0) {
                    cart.remove(produtoId);
                } else {
                    cart.put(produtoId, newQty);
                }
            } else {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", "Deve fornecer 'qty' ou 'delta' para atualizar."
                ));
                return;
            }

            sendCartResponse(request, response);
        } catch (JsonSyntaxException e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "JSON malformatado."
            ));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        
        Map<Integer, Integer> cart = getCartFromSession(request);
        String action = request.getParameter("action");

        if ("clear".equalsIgnoreCase(action)) {
            cart.clear();
            sendCartResponse(request, response);
            return;
        }

        int produtoId = -1;
        String idStr = request.getParameter("id");
        if (idStr != null && !idStr.trim().isEmpty()) {
            try {
                produtoId = Integer.parseInt(idStr);
            } catch (NumberFormatException ignored) {}
        }

        if (produtoId == -1 && isJsonRequest(request)) {
            try {
                JsonObject json = gson.fromJson(request.getReader(), JsonObject.class);
                if (json != null && json.has("id") && !json.get("id").isJsonNull()) {
                    produtoId = json.get("id").getAsInt();
                }
            } catch (Exception ignored) {}
        }

        if (produtoId <= 0) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "ID do produto inválido ou não fornecido."
            ));
            return;
        }

        cart.remove(produtoId);
        sendCartResponse(request, response);
    }

    private void sendCartResponse(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<Integer, Integer> cart = getCartFromSession(request);
        List<Map<String, Object>> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (Map.Entry<Integer, Integer> entry : cart.entrySet()) {
            int id = entry.getKey();
            int qty = entry.getValue();
            Produto p = produtoDAO.buscarPorId(id);
            if (p != null) {
                BigDecimal itemSubtotal = p.getPreco().multiply(BigDecimal.valueOf(qty));
                subtotal = subtotal.add(itemSubtotal);

                Map<String, Object> itemMap = new LinkedHashMap<>();
                itemMap.put("id", p.getId());
                itemMap.put("nome", p.getNome());
                itemMap.put("descricao", p.getDescricao());
                itemMap.put("preco", p.getPreco());
                itemMap.put("categoria", p.getCategoria());
                itemMap.put("imagemUrl", p.getImagemUrl());
                itemMap.put("qty", qty);
                itemMap.put("subtotal", itemSubtotal);

                items.add(itemMap);
            }
        }

        // Frete Grátis acima de R$ 500, senão R$ 19,90 (apenas se houver itens no carrinho)
        BigDecimal shipping = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(BigDecimal.valueOf(500)) <= 0) {
            shipping = new BigDecimal("19.90");
        }

        BigDecimal total = subtotal.add(shipping);

        Map<String, Object> cartData = new LinkedHashMap<>();
        cartData.put("success", true);
        cartData.put("items", items);
        cartData.put("subtotal", subtotal);
        cartData.put("shipping", shipping);
        cartData.put("total", total);
        cartData.put("count", cart.values().stream().mapToInt(Integer::intValue).sum());

        writeJson(response, HttpServletResponse.SC_OK, cartData);
    }

    private boolean isJsonRequest(HttpServletRequest request) {
        String contentType = request.getContentType();
        String accept = request.getHeader("Accept");
        return (contentType != null && contentType.contains("application/json")) ||
               (accept != null && accept.contains("application/json"));
    }

    private void writeJson(HttpServletResponse response, int status, Object body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        gson.toJson(body, response.getWriter());
    }
}
