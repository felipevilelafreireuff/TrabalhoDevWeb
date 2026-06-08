package com.devshop.controller;

import com.devshop.model.bean.Produto;
import com.devshop.model.dao.ProdutoDAO;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet({"", "/index"})
public class HomeServlet extends HttpServlet {
    private final Gson gson = new Gson();
    private ProdutoDAO produtoDAO;

    @Override
    public void init() {
        produtoDAO = new ProdutoDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String categoria = request.getParameter("categoria");
        List<Produto> produtos;

        if (categoria != null && !categoria.isEmpty() && !categoria.equals("todos")) {
            produtos = produtoDAO.listarPorCategoria(categoria);
        } else {
            produtos = produtoDAO.listarTodos();
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        gson.toJson(Map.of(
                "categoriaAtual", categoria != null ? categoria : "todos",
                "produtos", produtos
        ), response.getWriter());
    }
}
