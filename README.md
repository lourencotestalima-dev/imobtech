# ImobTech — API de Cadastro de Clientes

API REST desenvolvida em Node.js para gerenciamento de clientes no setor imobiliário, endereçando inconsistência de dados, operações em lote, padronização e rastreabilidade.

---

## Tecnologias

| Tecnologia | Justificativa |
|---|---|
| **Express + routing-controllers** | Decorators tornam a definição de rotas declarativa e integram nativamente com TypeDI e OpenAPI |
| **PostgreSQL** | Banco relacional extramemente utilizado e completo |
| **TypeORM** | ORM muito utilizado para Banco de Dados relacionais com migrations versionadas, garantindo rastreabilidade e permitindo reversão das alterações
| **TypeDI** | Injeção de dependência de forma simples, sem exigir muita configuração
| **argon2** | Algoritmo muito seguro e confiável para criptografia |
| **Pino** | Logger estruturado de alta performance, sem complexidade ou configuraçao desnecessária |
| **Swagger (routing-controllers-openapi)** | Documentação gerada automaticamente a partir dos endpoints

---

## Pré-requisitos

- Node.js 20+ **ou** Docker

---

## Opção 1 — Rodando com Docker (recomendado)

A forma mais simples. Sobe a API e o PostgreSQL juntos, sem precisar instalar nada além do Docker.

```bash
docker-compose up --build
```

Aguarde a mensagem:
```
🌐 Conexão com o Banco de Dados estabelecida com sucesso!
Servidor rodando na porta 3000...
```

> A API já roda as migrations automaticamente na primeira inicialização.

**Rodar:**
```bash
docker-compose up --build
```

**Parar:**
```bash
docker-compose down
```

**Parar e apagar os dados do banco:**
```bash
docker-compose down -v
```

---

## Opção 2 — Rodando localmente

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# edite .env com suas credenciais
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgres://user:pass@localhost:5432/imobtech` |
| `JWT_PRIVATE_KEY` | Chave secreta para assinar tokens JWT | `super-secret-key` |
| `PORT` | Porta da API (opcional) | `3000` |

### 3. Executar migrations

```bash
npm run migration:run
```

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

---

## Acessar a documentação

```
Com a aplicação rodando, basta acessar: http://localhost:3000/docs
```

---

## Rodando os testes

Basta usar o comando abaixo:
```bash
npm test
```

---

## Rotas da API

### Auth

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário | ❌ |
| `POST` | `/auth/login` | Login — retorna JWT | ❌ |

### Customer

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/customer` | Cadastrar cliente | ✅ |
| `GET` | `/customer` | Listar clientes com filtros e paginação | ✅ |
| `GET` | `/customer/:id` | Buscar cliente por ID | ✅ |
| `PUT` | `/customer/:id` | Atualizar cliente | ✅ |
| `DELETE` | `/customer/:id` | Excluir cliente (soft-delete) | ✅ |
| `POST` | `/customer/upload-csv` | Importar clientes em lote via CSV | ✅ |

### Health

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/health` | Status da aplicação | ❌ |

---

## Parâmetros de busca — `GET /customer`

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `name` | string | Filtrar por nome |
| `email` | string | Filtrar por e-mail |
| `taxIdentifier` | string | Filtrar por CPF/CNPJ |
| `type` | number | `1` = Pessoa Física, `2` = Pessoa Jurídica |
| `page` | number | Página (padrão: 1) |
| `limit` | number | Itens por página (padrão: 10) |
| `order` | string | `ASC` ou `DESC` |

---

## Importação em lote — CSV

O endpoint `POST /customer/upload-csv` aceita um arquivo `.csv` com as colunas:

```csv
name,email,taxIdentifier,type
João Silva,joao@email.com,12345678900,PF
Empresa LTDA,empresa@email.com,12345678000195,PJ
```

- `type`: `PF` = Pessoa Física, `PJ` = Pessoa Jurídica
- Operação de **upsert** — conflitos em `taxIdentifier` são atualizados
- Linhas com dados inválidos são rejeitadas com detalhamento do erro

---

## Decisões técnicas

### Soft-delete com rastreabilidade
Registros excluídos não são removidos do banco — recebem `deletedAt` e `deletedBy`. Isso permite auditoria completa e recuperação de dados.

### createdBy / updatedBy / deletedBy
Todos os campos de auditoria são preenchidos automaticamente com o `userId` extraído do token JWT, sem depender do cliente informar quem realizou a operação.

### Arquitetura em camadas
```
Controller → Service → Repository → Banco
```
Cada camada tem responsabilidade única. O `GenericRepository` abstrai o TypeORM, tornando os services independentes do ORM — facilitando testes e eventual troca de banco.

### Rate limiting
Rotas de autenticação limitadas a **20 requisições por 2 minutos** por IP, mitigando ataques de força bruta.

### Logs estruturados
Pino registra todas as requisições em JSON em `logs/requests.json`, incluindo `requestId` para correlação de logs de uma mesma requisição.
