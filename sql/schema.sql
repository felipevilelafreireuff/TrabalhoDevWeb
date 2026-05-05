-- schema.sql (PostgreSQL)

DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    papel VARCHAR(20) NOT NULL DEFAULT 'CLIENTE'
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagem_url VARCHAR(255)
);
