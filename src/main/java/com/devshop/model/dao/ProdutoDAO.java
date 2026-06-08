package com.devshop.model.dao;

import com.devshop.model.bean.Produto;
import com.devshop.util.ConnectionPool;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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

    public boolean cadastrar(Produto produto) {
        String sql = "INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, produto.getNome());
            stmt.setString(2, produto.getDescricao());
            stmt.setBigDecimal(3, produto.getPreco());
            stmt.setString(4, produto.getCategoria());
            stmt.setString(5, produto.getImagemUrl());
            
            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        produto.setId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Erro ao cadastrar produto: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    public boolean atualizar(Produto produto) {
        String sql = "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria = ?, imagem_url = ? WHERE id = ?";
        
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, produto.getNome());
            stmt.setString(2, produto.getDescricao());
            stmt.setBigDecimal(3, produto.getPreco());
            stmt.setString(4, produto.getCategoria());
            stmt.setString(5, produto.getImagemUrl());
            stmt.setInt(6, produto.getId());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao atualizar produto: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletar(int id) {
        String sql = "DELETE FROM produtos WHERE id = ?";
        
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Erro ao deletar produto: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    public Produto buscarPorId(int id) {
        String sql = "SELECT * FROM produtos WHERE id = ?";
        
        try (Connection conn = ConnectionPool.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Produto(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("descricao"),
                        rs.getBigDecimal("preco"),
                        rs.getString("categoria"),
                        rs.getString("imagem_url")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Erro ao buscar produto por id: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
