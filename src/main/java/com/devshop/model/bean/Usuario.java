package com.devshop.model.bean;

public class Usuario {
    private int id;
    private String nome;
    private String email;
    private String senha;
    private String papel; // 'ADMIN' ou 'CLIENTE'

    public Usuario() {}

    public Usuario(int id, String nome, String email, String senha, String papel) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.papel = papel;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getPapel() { return papel; }
    public void setPapel(String papel) { this.papel = papel; }
}
