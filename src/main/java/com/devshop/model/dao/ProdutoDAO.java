package com.devshop.model.dao;

import com.devshop.model.bean.Produto;
import com.devshop.util.ConnectionPool;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProdutoDAO {

    public List<Produto> listarTodos() {
        List<Produto> produtos = new ArrayList<>();
        String sql = "SELECT * FROM produtos ORDER BY id ASC";
        
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                produtos.add(new Produto(
                    rs.getInt("id"),
                    rs.getString("nome"),
                    rs.getString("descricao"),
                    rs.getBigDecimal("preco"),
                    rs.getString("categoria"),
                    rs.getString("imagem_url")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Erro ao listar produtos: " + e.getMessage());
            e.printStackTrace();
        }
        
        return produtos;
    }

    public List<Produto> listarPorCategoria(String categoria) {
        List<Produto> produtos = new ArrayList<>();
        String sql = "SELECT * FROM produtos WHERE categoria = ? ORDER BY id ASC";
        
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, categoria);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    produtos.add(new Produto(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("descricao"),
                        rs.getBigDecimal("preco"),
                        rs.getString("categoria"),
                        rs.getString("imagem_url")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("Erro ao listar produtos por categoria: " + e.getMessage());
            e.printStackTrace();
        }
        
        return produtos;
    }
}
