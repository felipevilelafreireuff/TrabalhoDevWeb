-- data.sql (PostgreSQL)

-- Inserindo usuários com senhas em texto puro, conforme solicitado para teste
INSERT INTO usuarios (nome, email, senha, papel) VALUES
('Administrador', 'admin@devshop.com', 'admin123', 'ADMIN'),
('João Silva', 'joao@email.com', '123456', 'CLIENTE');

-- Inserindo produtos
INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url) VALUES
('Teclado Mecânico RGB', 'Teclado mecânico switch blue', 350.00, 'perifericos', 'https://via.placeholder.com/300?text=Teclado'),
('Mouse Gamer 10000 DPI', 'Mouse ergonômico de alta precisão', 150.00, 'perifericos', 'https://via.placeholder.com/300?text=Mouse'),
('Monitor 24" Full HD', 'Monitor LED IPS 75Hz', 899.90, 'monitores', 'https://via.placeholder.com/300?text=Monitor'),
('Headset Surround 7.1', 'Headset com microfone com cancelamento de ruído', 299.00, 'audio', 'https://via.placeholder.com/300?text=Headset'),
('Webcam Full HD', 'Webcam 1080p para streaming', 250.00, 'cameras', 'https://via.placeholder.com/300?text=Webcam');
