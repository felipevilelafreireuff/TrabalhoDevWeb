package com.devshop.controller;

import com.devshop.model.bean.Produto;
import com.devshop.model.dao.ProdutoDAO;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet({"", "/index"})
public class HomeServlet extends HttpServlet {
    private ProdutoDAO produtoDAO;

    @Override
    public void init() {
        produtoDAO = new ProdutoDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String categoria = request.getParameter("categoria");
        List<Produto> produtos;

        if (categoria != null && !categoria.isEmpty() && !categoria.equals("todos")) {
            produtos = produtoDAO.listarPorCategoria(categoria);
        } else {
            produtos = produtoDAO.listarTodos();
        }

        request.setAttribute("produtos", produtos);
        request.setAttribute("categoriaAtual", categoria != null ? categoria : "todos");

        request.getRequestDispatcher("/WEB-INF/views/index.jsp").forward(request, response);
    }
}
