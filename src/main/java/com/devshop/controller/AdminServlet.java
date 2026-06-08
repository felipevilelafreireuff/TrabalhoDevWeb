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

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@WebServlet("/admin")
public class AdminServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private ProdutoDAO produtoDAO;

    @Override
    public void init() {
        produtoDAO = new ProdutoDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        String idStr = request.getParameter("id");
        if (idStr != null && !idStr.trim().isEmpty()) {
            try {
                int id = Integer.parseInt(idStr);
                Produto produto = produtoDAO.buscarPorId(id);
                if (produto != null) {
                    writeJson(response, HttpServletResponse.SC_OK, Map.of(
                            "success", true,
                            "produto", produto
                    ));
                } else {
                    writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of(
                            "success", false,
                            "message", "Produto não encontrado."
                    ));
                }
            } catch (NumberFormatException e) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", "ID inválido."
                ));
            }
            return;
        }

        List<Produto> produtos = produtoDAO.listarTodos();
        writeJson(response, HttpServletResponse.SC_OK, Map.of(
                "success", true,
                "produtos", produtos
        ));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        if (!isJsonRequest(request)) {
            writeJson(response, HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, Map.of(
                    "success", false,
                    "message", "Content-Type deve ser application/json."
            ));
            return;
        }

        try {
            Produto produto = gson.fromJson(request.getReader(), Produto.class);
            if (produto == null) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", "JSON vazio ou inválido."
                ));
                return;
            }

            String validationError = validarProduto(produto, false);
            if (validationError != null) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", validationError
                ));
                return;
            }

            boolean cadastrado = produtoDAO.cadastrar(produto);
            if (cadastrado) {
                writeJson(response, HttpServletResponse.SC_CREATED, Map.of(
                        "success", true,
                        "message", "Produto cadastrado com sucesso!",
                        "produto", produto
                ));
            } else {
                writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of(
                        "success", false,
                        "message", "Erro ao salvar o produto no banco de dados."
                ));
            }
        } catch (JsonSyntaxException e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "JSON malformatado: " + e.getMessage()
            ));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        if (!isJsonRequest(request)) {
            writeJson(response, HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, Map.of(
                    "success", false,
                    "message", "Content-Type deve ser application/json."
            ));
            return;
        }

        try {
            Produto produto = gson.fromJson(request.getReader(), Produto.class);
            if (produto == null) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", "JSON vazio ou inválido."
                ));
                return;
            }

            String validationError = validarProduto(produto, true);
            if (validationError != null) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                        "success", false,
                        "message", validationError
                ));
                return;
            }

            Produto existente = produtoDAO.buscarPorId(produto.getId());
            if (existente == null) {
                writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of(
                        "success", false,
                        "message", "Produto não encontrado para atualização."
                ));
                return;
            }

            boolean atualizado = produtoDAO.atualizar(produto);
            if (atualizado) {
                writeJson(response, HttpServletResponse.SC_OK, Map.of(
                        "success", true,
                        "message", "Produto atualizado com sucesso!",
                        "produto", produto
                ));
            } else {
                writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of(
                        "success", false,
                        "message", "Erro ao atualizar o produto no banco de dados."
                ));
            }
        } catch (JsonSyntaxException e) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "JSON malformatado: " + e.getMessage()
            ));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        int id = -1;

        // Tenta buscar o ID da query string primeiro
        String idStr = request.getParameter("id");
        if (idStr != null && !idStr.trim().isEmpty()) {
            try {
                id = Integer.parseInt(idStr);
            } catch (NumberFormatException ignored) {}
        }

        // Se não achou na query string e for JSON, tenta buscar no corpo JSON
        if (id == -1 && isJsonRequest(request)) {
            try {
                JsonObject json = gson.fromJson(request.getReader(), JsonObject.class);
                if (json != null && json.has("id") && !json.get("id").isJsonNull()) {
                    id = json.get("id").getAsInt();
                }
            } catch (Exception ignored) {}
        }

        if (id <= 0) {
            writeJson(response, HttpServletResponse.SC_BAD_REQUEST, Map.of(
                    "success", false,
                    "message", "ID do produto inválido ou não fornecido."
            ));
            return;
        }

        Produto existente = produtoDAO.buscarPorId(id);
        if (existente == null) {
            writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of(
                    "success", false,
                    "message", "Produto não encontrado."
            ));
            return;
        }

        boolean deletado = produtoDAO.deletar(id);
        if (deletado) {
            writeJson(response, HttpServletResponse.SC_OK, Map.of(
                    "success", true,
                    "message", "Produto deletado com sucesso!"
            ));
        } else {
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, Map.of(
                    "success", false,
                    "message", "Erro ao deletar o produto no banco de dados."
            ));
        }
    }

    private boolean isJsonRequest(HttpServletRequest request) {
        return request.getContentType() != null && request.getContentType().contains("application/json");
    }

    private String validarProduto(Produto produto, boolean exigeId) {
        if (exigeId && produto.getId() <= 0) {
            return "ID do produto inválido.";
        }
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            return "O nome do produto é obrigatório.";
        }
        if (produto.getPreco() == null || produto.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            return "O preço do produto é obrigatório e deve ser maior que zero.";
        }
        if (produto.getCategoria() == null || produto.getCategoria().trim().isEmpty()) {
            return "A categoria do produto é obrigatória.";
        }
        return null;
    }

    private void writeJson(HttpServletResponse response, int status, Object body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        gson.toJson(body, response.getWriter());
    }
}
