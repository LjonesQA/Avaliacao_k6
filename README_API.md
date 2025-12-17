# Bibliotecas Utilizadas

As seguintes bibliotecas estão instaladas neste projeto:

- express
- swagger-ui-express
- mocha
- chai
- sinon
- supertest


# API de Transferências

Esta API permite realizar operações de registro, login, consulta de usuários e transferências de valores entre usuários, com regras básicas de negócio. O objetivo é servir de base para aprendizado de testes e automação de APIs.

Agora também expõe uma interface GraphQL, permitindo realizar as mesmas operações via queries e mutations, com autenticação JWT nas mutations sensíveis.

## API GraphQL

### Execução

Para iniciar o servidor GraphQL:
```powershell
node graphql/server.js
```
Acesse em: `http://localhost:4000/graphql`

### Operações Principais

- `login(username, password): AuthPayload` — Realiza login e retorna token JWT.
- `users: [User]` — Lista todos os usuários.
- `user(username): User` — Consulta usuário por username.
- `transfers: [Transfer]` — Lista todas as transferências.
- `createTransfer(from, to, value): Transfer` — Cria transferência (requer autenticação JWT).


### Testes GraphQL

Para rodar os testes automatizados da API GraphQL (é necessário que o servidor GraphQL esteja rodando):
```powershell
npm run test-graphql
```
O relatório será gerado na pasta `mochawesome-report`.

### Autenticação

Após o login, será retornado um token JWT. Para acessar mutations protegidas, envie o token no header:
```
authorization: Bearer <token>
```

---

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências principais:
   ```powershell
   npm install express swagger-ui-express
   ```
3. Instale outras dependências do projeto (se houver):
   ```powershell
   npm install
   ```

## Execução

Para iniciar o servidor:
```powershell
node server.js
```
A API estará disponível em `http://localhost:3000`.

## Endpoints

* `POST /register`: Registra um novo usuário. Não permite usuários duplicados.
* `POST /login`: Realiza login. Login e senha obrigatórios. Retorna um token de autenticação.
* `GET /users`: Lista todos os usuários (requer token).
* `POST /transfer`: Realiza transferência (requer token). Só permite valores acima de R$ 5.000,00 para favorecidos.
* `GET /transfers`: Lista todas as transferências (requer token).
* `GET /api-docs`: Documentação Swagger interativa.

## Regras de Negócio

* Login exige usuário e senha.
* Não é possível registrar usuários duplicados.
* Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
* Endpoints de consulta de usuários, transferências e realização de transferências exigem autenticação via token.

## Testes

Para testar a API com Supertest, importe o `app.js` em seus testes sem iniciar o servidor.

## Autenticação

Após o login, será retornado um token. Para acessar os endpoints protegidos, envie o token no header `authorization`:

```http
GET /users
authorization: <token>
```

O mesmo vale para transferências e consulta de transferências.

## Documentação

Acesse `/api-docs` para visualizar e testar os endpoints via Swagger UI.

---

API criada para fins educacionais.
