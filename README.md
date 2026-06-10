# DevShop - Sistema Web Seguro com React e Servlets

DevShop e um mini e-commerce academico refatorado para uma arquitetura desacoplada:

- `frontend/`: aplicacao React com Vite, rotas, componentes reutilizaveis, estado e chamadas assicronas.
- `src/main/java`: API Java Servlet que retorna JSON para o React.
- `bruno/`: collections de testes da API usando Bruno.
- `sql/`: scripts de criacao e carga inicial do PostgreSQL.

## Links

- Front-end no GitHub Pages: https://felipevilelafreireuff.github.io/TrabalhoDevWeb/
- API local: http://localhost:8080/devshop
- Front-end local: http://127.0.0.1:5173/

> O front-end publicado no GitHub Pages usa a API em `http://localhost:8080/devshop`. Para testar a versao publicada, suba a API local primeiro.

## Requisitos

- Java 17+
- PostgreSQL
- Node.js 20+
- Bruno, para executar os testes da API

## Configurar Banco

1. Crie um banco PostgreSQL chamado `devshop`.
2. Copie `.env.example` para `.env`.
3. Ajuste usuario e senha no `.env`.
4. Execute os scripts:

```sql
sql/schema.sql
sql/data.sql
```

Usuarios de teste:

- Administrador: `admin@devshop.com` / `admin123`
- Cliente: `joao@email.com` / `123456`

## Rodar a API Java

Na raiz do projeto:

```bash
.\mvnw.cmd clean package cargo:run
```

No Linux/Mac:

```bash
./mvnw clean package cargo:run
```

A API ficara disponivel em:

```text
http://localhost:8080/devshop
```

Principais endpoints:

- `GET /index`: lista produtos para a vitrine.
- `GET /login`: consulta status da sessao.
- `POST /login`: autentica usuario.
- `POST /logout`: encerra sessao.
- `GET /carrinho`: retorna carrinho em JSON.
- `POST /carrinho`: adiciona item.
- `PUT /carrinho`: altera quantidade.
- `DELETE /carrinho`: remove item.
- `GET /admin`: lista produtos para administrador.
- `POST /admin`: cadastra produto.
- `PUT /admin`: atualiza produto.
- `DELETE /admin`: remove produto.

## Rodar o Front-end React

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse:

```text
http://127.0.0.1:5173/
```

No Windows, tambem e possivel usar o atalho:

```bat
testar-local.bat
```

## Testar a API com Bruno

1. Suba a API Java.
2. Abra o Bruno.
3. Importe ou abra as pastas:
   - `bruno/devshop-auth`
   - `bruno/devshop-admin`
4. Selecione o ambiente `Local`.
5. Execute primeiro `Login` em `devshop-auth` para criar a sessao.
6. Execute os testes de `devshop-admin`: listar, cadastrar, atualizar e deletar produto.

## Build e Deploy

Build local do front-end:

```bash
cd frontend
npm run build
```

O deploy automatico do GitHub Pages esta configurado em `.github/workflows/deploy.yml`. A cada push na branch `main`, o workflow gera `frontend/dist` e publica na branch `gh-pages`.

## Como o Projeto Atende ao Trabalho

- O front-end React substitui a renderizacao JSP.
- Os Servlets atuam como API JSON.
- Componentes React reutilizaveis reduzem repeticao visual.
- `useState`, `useEffect`, eventos e renderizacao condicional controlam a interface sem recarregar a pagina inteira.
- `fetch` centralizado em `frontend/src/services/apiClient.js` integra React e Java de forma assincrona.
- Collections Bruno documentam e testam endpoints de autenticacao e CRUD.
