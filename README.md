# Sistema Restaurante

Este projeto é uma API para gerenciamento de pedidos, produtos, clientes e usuários de um restaurante.

## Estrutura das Rotas da API

Abaixo estão os principais endpoints, métodos suportados, exemplos de body e possíveis retornos.

---

### Adicionais
- `GET /api/adicionais`  
  **Retorno:**  
  - `200 OK` (lista de adicionais)


- `POST /api/adicionais`  
  **Body:**  
  ```json
  {
    "nome": "string",
    "preco": number
  }
  ```
  **Retorno:**  
  - `201 Created`
  - `400 Bad Request`

- `PATCH /api/adicionais`  
  **Body:**  
  ```json
  {
    "id": "string", 
  "nome": "string", 
  "preco": number
  }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

- `DELETE /api/adicionais`  
  **Body:**  
  ```json
  { "id": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

### Categorias
- `GET /api/categorias`  
  **Retorno:**  
  - `200 OK` (lista de categorias)

- `POST /api/categorias`  
  **Body:**  
  ```json
  { "nome": "string" }
  ```
  **Retorno:**  
  - `201 Created`
  - `400 Bad Request`

- `PATCH /api/categorias`  
  **Body:**  
  ```json
  { "id": "string", "nome": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

- `DELETE /api/categorias`  
  **Body:**  
  ```json
  { "id": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

### Clientes
- `GET /api/clientes`  
  **Retorno:**  
  - `200 OK` (lista de clientes)

- `POST /api/clientes`  
  **Body:**  
  ```json
  { "nome": "string", "telefone": "string", "email": "string (opcional)" }
  ```
  **Retorno:**  
  - `201 Created`
  - `400 Bad Request`

- `PATCH /api/clientes`  
  **Body:**  
  ```json
  { "id": "string", "nome": "string", "telefone": "string", "email": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

- `DELETE /api/clientes`  
  **Body:**  
  ```json
  { "id": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

### Estabelecimento
- `GET /api/estabelecimento`  
  **Retorno:**  
  - `200 OK` (dados do estabelecimento)

- `PATCH /api/estabelecimento`  
  **Body:**  
  ```json
  { "nome": "string", "endereco": "string", ... }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

#### Segurança
- `GET /api/estabelecimento/seguranca`  
  **Retorno:**  
  - `200 OK` (configurações de segurança)

- `PATCH /api/estabelecimento/seguranca`  
  **Body:**  
  ```json
  { "configuracoes": {...} }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

### Imprimir
- `POST /api/imprimir`  
  **Body:**  
  ```json
  { "pedidoId": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

### Login
- `POST /api/login`  
  **Body:**  
  ```json
  { "usuario": "string", "senha": "string" }
  ```
  **Retorno:**  
  - `200 OK` (token)
  - `401 Unauthorized`

---

### Logout
- `POST /api/logout`  
  **Body:**  
  ```json
  { "token": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `400 Bad Request`

---

### Me
- `GET /api/me`  
  **Retorno:**  
  - `200 OK` (dados do usuário autenticado)

---

### Pedidos
- `GET /api/pedidos`  
  **Retorno:**  
  - `200 OK` (lista de pedidos)

- `POST /api/pedidos`  
  **Body:**  
  ```json
  { "clienteId": "string", "produtos": [...], "adicionais": [...] }
  ```
  **Retorno:**  
  - `201 Created`
  - `400 Bad Request`

- `PATCH /api/pedidos`  
  **Body:**  
  ```json
  { "id": "string", ... }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

- `DELETE /api/pedidos`  
  **Body:**  
  ```json
  { "id": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

#### Cancelar Pedido
- `POST /api/pedidos/cancelar`  
  **Body:**  
  ```json
  { "pedidoId": "string", "motivo": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

#### Finalizar Pedido
- `POST /api/pedidos/finalizar`  
  **Body:**  
  ```json
  { "pedidoId": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

#### Pedidos Pendentes
- `GET /api/pedidos/pendente`  
  **Retorno:**  
  - `200 OK` (lista de pedidos pendentes)

---

### Produtos
- `GET /api/produtos`  
  **Retorno:**  
  - `200 OK` (lista de produtos)

- `POST /api/produtos`  
  **Body:**  
  ```json
  { "nome": "string", "preco": number, "categoriaId": "string" }
  ```
  **Retorno:**  
  - `201 Created`
  - `400 Bad Request`

- `PATCH /api/produtos`  
  **Body:**  
  ```json
  { "id": "string", "nome": "string", "preco": number, "categoriaId": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

- `DELETE /api/produtos`  
  **Body:**  
  ```json
  { "id": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

#### Categoria de Produto
- `GET /api/produtos/categoria`  
  **Retorno:**  
  - `200 OK` (lista de categorias de produtos)

---

### Recuperar Acesso
- `POST /api/recuperar-acesso`  
  **Body:**  
  ```json
  { "email": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---

### Usuários
- `GET /api/usuarios`  
  **Retorno:**  
  - `200 OK` (lista de usuários)

- `POST /api/usuarios`  
  **Body:**  
  ```json
  { "nome": "string", "usuario": "string", "senha": "string", "tipo": "string" }
  ```
  **Retorno:**  
  - `201 Created`
  - `400 Bad Request`

- `PATCH /api/usuarios`  
  **Body:**  
  ```json
  { "id": "string", "nome": "string", "usuario": "string", "senha": "string", "tipo": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

- `DELETE /api/usuarios`  
  **Body:**  
  ```json
  { "id": "string" }
  ```
  **Retorno:**  
  - `200 OK`
  - `404 Not Found`

---