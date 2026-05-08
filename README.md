# DevShop - Sistema Web MVC Seguro

Este projeto é um mini e-commerce (DevShop) desenvolvido como requisito acadêmico para demonstrar a aplicação de uma **Arquitetura MVC** segura utilizando **Java Web (Servlets e JSP)**.

## 🏛️ Arquitetura MVC Implementada

A separação de responsabilidades foi rigorosamente aplicada:
- **Controller (Servlets):** Interceptam requisições HTTP (`/login`, `/admin`, `/index`), processam regras de negócio comunicando-se com o Model, e utilizam `RequestDispatcher.forward()` para despachar o resultado para as Views.
- **Model (JavaBeans e DAOs):** O domínio é representado pelas classes `Produto` e `Usuario`. O acesso ao banco é isolado nas classes `ProdutoDAO` e `UsuarioDAO`, mantendo o Controller limpo.
- **View (JSP):** O HTML final é renderizado no lado do servidor. Lógicas complexas foram removidas da interface. Os dados são iterados utilizando a biblioteca **JSTL** (`<c:forEach>`, `<c:out>`). O acesso direto às páginas `.jsp` foi bloqueado movendo-as para o diretório protegido `WEB-INF/views/`.

## 💾 Persistência e Armazenamento

O sistema aborda os múltiplos níveis de armazenamento exigidos:
1. **Banco de Dados Relacional:** Utiliza **PostgreSQL**.
2. **Connection Pool:** Implementado via **HikariCP** (`ConnectionPool.java`), garantindo performance ao não abrir/fechar conexões em cada query.
3. **Sessões (HttpSession):** Autenticação persistida na memória do servidor. O objeto `Usuario` é guardado na sessão (`session.setAttribute("usuarioLogado")`).
4. **Cookies:** O Front-end gerencia leitura e escrita de Cookies via JavaScript para persistir preferências do usuário (Tema Claro/Escuro e Idioma da interface).
5. **Cache HTTP:** O `CacheFilter` intercepta requisições injetando headers de controle de cache (`Cache-Control: no-cache, no-store`), garantindo que páginas dinâmicas e sessões expiradas não sejam armazenadas pelo cache do navegador.

## 🛡️ Segurança

- **Front-end:** JS de validação implementado para interceptar submissões de formulário incompletas ou incorretas.
- **Prevenção contra SQL Injection:** Toda e qualquer consulta ao banco de dados utiliza estritamente `PreparedStatement`.
- **Autenticação e Autorização:** O `LoginServlet` lida com a autenticação via Form-Based. A autorização é garantida pelo `AuthFilter`, que checa ativamente os Security Roles (ex: Bloqueia qualquer usuário de acessar `/admin` que não tenha o papel `ADMIN`).
- **Proteção XSS:** Utilização de `<c:out>` do JSTL para escapar caracteres especiais na renderização do HTML dinâmico.

## 🚀 Como Compilar e Rodar o Projeto (Passo a Passo)

Para executar este projeto localmente, é necessário ter o **Java 17+** e o **PostgreSQL** instalados na sua máquina.

### Passo 1: Configurar Variáveis de Ambiente
O projeto utiliza um arquivo `.env` para proteger as credenciais do banco de dados.
1. Na raiz do projeto, faça uma cópia do arquivo `.env.example` e renomeie a cópia para `.env`.
2. Abra o arquivo `.env` e substitua os valores fictícios pelas suas credenciais reais do PostgreSQL:
```env
DB_URL=jdbc:postgresql://localhost:5432/devshop
DB_USER=seu_usuario_do_postgres
DB_PASS=sua_senha_do_postgres
```

### Passo 2: Preparar o Banco de Dados
1. Abra sua ferramenta de banco de dados (ex: pgAdmin, DBeaver ou psql) e conecte-se ao seu servidor local (porta 5432).
2. Crie um banco de dados em branco chamado `devshop`.
3. Execute o script `sql/schema.sql` para criar a estrutura das tabelas.
4. Execute o script `sql/data.sql` para popular o banco com os produtos e os seguintes usuários de teste:
   - **Administrador:** `admin@devshop.com` / Senha: `admin123`
   - **Cliente:** `joao@email.com` / Senha: `123456`

### Passo 3: Subir o Servidor (Tomcat Embutido)
O projeto conta com o `cargo-maven3-plugin`, que baixa e executa um servidor Tomcat 10 automaticamente, sem necessidade de configuração externa.

Abra o terminal na pasta raiz do projeto e execute:
```bash
# Se você tiver o Maven instalado globalmente no seu computador:
mvn clean package cargo:run

# Se você NÃO tiver o Maven instalado (Use o Wrapper embutido na pasta):
# No Windows (PowerShell/CMD):
.\mvnw.cmd clean package cargo:run
# No Linux/Mac:
./mvnw clean package cargo:run
```

Aguarde o download das dependências e a inicialização do servidor. Assim que o terminal indicar que o Tomcat foi iniciado, acesse no seu navegador:

👉 **http://localhost:8080/devshop**
