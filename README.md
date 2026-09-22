# ☕ QueroKafé

**Marketplace agregador de cafés especiais.** O QueroKafé não vende café: ele reúne, em um só lugar, os produtos de várias torrefações e marcas, permitindo que o usuário **descubra, compare e filtre** opções por tipo de grão, torra, processo, região de origem, método de preparo, notas sensoriais e faixa de preço. Ao encontrar o café certo, o usuário é **redirecionado para a loja parceira**, onde a compra acontece.

- **Valor para o consumidor:** economizar tempo e decidir com mais clareza, sem visitar dezenas de sites.
- **Valor para a torrefação:** visibilidade e tráfego qualificado.

> **Escopo deste MVP:** camada de descoberta (catálogo, filtros e redirecionamento) + painel administrativo com CRUD completo das entidades. Evoluir para um e-commerce com checkout próprio é uma fase futura.

---

## 📑 Sumário

- [Stack](#-stack)
- [Arquitetura](#-arquitetura)
- [Modelo de dados](#-modelo-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução](#-instalação-e-execução)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [API REST](#-api-rest)
- [Deploy](#️-deploy)
- [Estrutura de pastas](#-estrutura-de-pastas)

---

## 🧰 Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | [Next.js 16](https://nextjs.org) (App Router, React 19, Server Components e Server Actions) + TypeScript + Tailwind CSS 4 |
| Backend | [NestJS 12](https://nestjs.com) + TypeScript, validação com `class-validator` e documentação com Swagger |
| ORM | [Prisma 7](https://www.prisma.io) com driver adapter `@prisma/adapter-pg` |
| Banco de dados | PostgreSQL |
| Testes | Vitest (unitários no backend) |
| Monorepo | npm workspaces |

## 🏗 Arquitetura

```
┌──────────────────────┐        HTTP/JSON        ┌──────────────────────┐      SQL      ┌────────────┐
│   apps/web           │  ────────────────────▶  │   apps/api           │  ──────────▶  │ PostgreSQL │
│   Next.js (Vercel)   │                         │   NestJS (Vercel)    │   (Prisma)    │ (Supabase) │
│                      │  ◀────────────────────  │                      │  ◀──────────  │            │
│  • catálogo público  │                         │  • CRUD REST         │               └────────────┘
│  • painel admin      │                         │  • validação de DTOs │
│  • Server Actions    │                         │  • Swagger em /docs  │
└──────────────────────┘                         └──────────────────────┘
```

O frontend **nunca fala com o banco diretamente**: toda leitura e escrita passa pela API REST, através do cliente tipado em [`apps/web/src/lib/api.ts`](apps/web/src/lib/api.ts). As mutações do painel administrativo usam **Server Actions** do Next.js, que chamam a API no servidor e revalidam o cache das páginas.

## 🗄 Modelo de dados

Quatro entidades, com relações 1-N e N-N:

```
Roaster (torrefação) ──1:N──▶ Coffee (café) ──N:N──▶ FlavorNote (nota sensorial)
                                    │
                                    └────N:N──▶ BrewMethod (método de preparo)
```

| Entidade | Descrição | Campos principais |
| --- | --- | --- |
| **Roaster** | Torrefação/marca parceira | `name`, `slug`, `websiteUrl`, `city`, `state` |
| **Coffee** | Café anunciado; é o item comparável do catálogo | `name`, `priceCents`, `weightGrams`, `beanType`, `roastLevel`, `process`, `origin`, `scaScore`, `storeUrl`, `clickCount` |
| **FlavorNote** | Descritor de sabor (chocolate, caramelo...) | `name`, `slug` |
| **BrewMethod** | Método de preparo (espresso, V60...) | `name`, `slug`, `description` |

Detalhes em [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma). Decisões de modelagem:

- **Preço em centavos (`Int`)** evita erros de arredondamento de ponto flutuante.
- **`slug` único** dá URLs legíveis (`/cafes/bourbon-amarelo-natural`) e filtros compartilháveis.
- **`clickCount`** registra quantos usuários seguiram o link para a loja — a métrica que interessa a um agregador.
- **`onDelete: Cascade`** em `Coffee.roaster`: remover uma torrefação remove seus anúncios.

## ✨ Funcionalidades

**Catálogo público**

- Vitrine com todos os cafés das torrefações parceiras.
- Filtros combináveis por torrefação, tipo de grão, torra, processo, método de preparo, nota sensorial e faixa de preço, além de busca textual e ordenação (recentes, menor/maior preço, pontuação SCA).
- Filtros gravados na query string: a URL do resultado é compartilhável.
- Página de detalhe com ficha técnica, comparação de preço por quilo e **redirecionamento rastreado** para a loja.
- Listagem das torrefações parceiras.

**Painel administrativo (`/admin`) — CRUD completo**

| Entidade | Criar | Listar | Editar | Excluir |
| --- | :---: | :---: | :---: | :---: |
| Cafés | ✅ | ✅ | ✅ | ✅ |
| Torrefações | ✅ | ✅ | ✅ | ✅ |
| Notas sensoriais | ✅ | ✅ | ✅ | ✅ |
| Métodos de preparo | ✅ | ✅ | ✅ | ✅ |

## 📋 Pré-requisitos

- **Node.js 20 ou superior** e npm 10+
- Um banco **PostgreSQL** (usamos o [Supabase](https://supabase.com), plano gratuito)
- Git

## 🚀 Instalação e execução

### 1. Clonar e instalar

```bash
git clone <url-do-repositorio>
cd QueroKafe
npm install
```

O `npm install` na raiz instala as dependências dos dois apps (npm workspaces).

### 2. Configurar as variáveis de ambiente

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local
```

Edite `apps/api/.env` com as duas URLs do seu banco. No Supabase, clique no botão **Connect** (topo da página) e abra o card **Direct — Connection string**:

- `DATABASE_URL` → aba **Transaction pooler** (porta 6543), usada pela API em runtime;
- `DIRECT_URL` → aba **Session pooler** (porta 5432), usada pelas migrations e pelo seed.

Em ambas, troque `[YOUR-PASSWORD]` pela senha do banco definida na criação do projeto.

### 3. Preparar o banco de dados

```bash
npm run db:migrate    # cria as tabelas a partir do schema do Prisma
npm run db:seed       # popula o banco com torrefações e cafés de exemplo
```

### 4. Rodar em desenvolvimento

```bash
npm run dev           # sobe a API (:3333) e o frontend (:3000) juntos
```

| Serviço | URL local |
| --- | --- |
| Frontend | http://localhost:3000 |
| Painel administrativo | http://localhost:3000/admin |
| API | http://localhost:3333/api |
| Documentação Swagger | http://localhost:3333/api/docs |

Para subir os apps separadamente: `npm run dev:api` e `npm run dev:web`.

## 🔐 Variáveis de ambiente

**`apps/api/.env`**

| Variável | Obrigatória | Descrição |
| --- | :---: | --- |
| `DATABASE_URL` | ✅ | Conexão usada pela API (Transaction pooler, porta 6543) |
| `DIRECT_URL` | — | Conexão usada por migrations e seed (Session pooler, porta 5432). Sem ela, o Prisma usa a `DATABASE_URL` |
| `PORT` | — | Porta da API (padrão `3333`) |
| `CORS_ORIGIN` | — | Origens liberadas, separadas por vírgula. Em produção, a URL do frontend |

**`apps/web/.env.local`**

| Variável | Obrigatória | Descrição |
| --- | :---: | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | URL base da API, incluindo `/api` |

## 📜 Scripts disponíveis

Rodados a partir da raiz do projeto:

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe frontend e backend simultaneamente |
| `npm run build` | Compila os dois apps para produção |
| `npm run test` | Executa os testes unitários do backend |
| `npm run lint` | Roda os linters dos dois apps |
| `npm run db:migrate` | Aplica as migrations em desenvolvimento |
| `npm run db:seed` | Popula o banco com dados de exemplo |
| `npm run db:studio` | Abre o Prisma Studio para inspecionar os dados |
| `npm run db:generate` | Regera o Prisma Client |

## 🔌 API REST

Base: `/api` · Documentação interativa (Swagger): `/api/docs`

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica API e conexão com o banco |
| `GET` | `/api/coffees` | Lista cafés com filtros e paginação |
| `GET` | `/api/coffees/:idOrSlug` | Detalha um café |
| `POST` | `/api/coffees` | Cria um café |
| `PATCH` | `/api/coffees/:id` | Atualiza um café |
| `DELETE` | `/api/coffees/:id` | Remove um café |
| `POST` | `/api/coffees/:idOrSlug/redirect` | Contabiliza o clique e devolve a URL da loja |
| `GET` `POST` | `/api/roasters` | Lista / cria torrefações |
| `GET` `PATCH` `DELETE` | `/api/roasters/:id` | Detalha / atualiza / remove uma torrefação |
| `GET` `POST` | `/api/flavor-notes` | Lista / cria notas sensoriais |
| `GET` `PATCH` `DELETE` | `/api/flavor-notes/:id` | Detalha / atualiza / remove uma nota |
| `GET` `POST` | `/api/brew-methods` | Lista / cria métodos de preparo |
| `GET` `PATCH` `DELETE` | `/api/brew-methods/:id` | Detalha / atualiza / remove um método |

**Filtros aceitos em `GET /api/coffees`:** `search`, `beanType`, `roastLevel`, `process`, `roaster`, `brewMethod`, `flavorNote`, `minPrice`, `maxPrice`, `sort`, `onlyActive`, `page`, `perPage`.

Exemplo:

```bash
curl "http://localhost:3333/api/coffees?roastLevel=CLARA&maxPrice=7000&sort=nota"
```

## ☁️ Deploy

O banco fica no Supabase e os dois apps vão para a Vercel, como **dois projetos separados**
criados a partir deste mesmo repositório — cada um apontando para uma pasta diferente.

### Banco — Supabase

1. Crie um projeto em [supabase.com](https://supabase.com), escolhendo a região mais próxima e uma senha forte para o banco.
2. Em **Connect → Direct connection string**, copie as URLs do **Transaction pooler** (porta 6543) e do **Session pooler** (porta 5432).

### Backend — Vercel (projeto 1)

1. **Add New → Project** e importe este repositório.
2. Em **Root Directory**, selecione `apps/api`. A configuração vem de [`apps/api/vercel.json`](apps/api/vercel.json).
3. Variáveis de ambiente:
   - `DATABASE_URL` → Transaction pooler do Supabase
   - `DIRECT_URL` → Session pooler do Supabase
   - `CORS_ORIGIN` → a URL do frontend (preencha depois do projeto 2 existir)
4. O build roda `prisma migrate deploy` antes de compilar, aplicando as migrations pendentes em produção.
5. Ao terminar, confira `https://<sua-api>.vercel.app/api/health` — deve responder `{"status":"ok"}`.

### Frontend — Vercel (projeto 2)

1. **Add New → Project**, importando o mesmo repositório.
2. Em **Root Directory**, selecione `apps/web`.
3. Variável de ambiente: `NEXT_PUBLIC_API_URL` = `https://<sua-api>.vercel.app/api`.
4. Volte ao projeto da API e preencha `CORS_ORIGIN` com a URL final do frontend, refazendo o deploy dela.

### Como a API roda em serverless

A Vercel não mantém um processo ligado: cada requisição invoca uma função. Por isso a API tem
dois pontos de entrada sobre a mesma configuração ([`app.factory.ts`](apps/api/src/app.factory.ts)):

- [`src/main.ts`](apps/api/src/main.ts) — servidor tradicional, usado em desenvolvimento e em qualquer host Node;
- [`api/[[...slug]].js`](apps/api/api/) — função da Vercel, uma rota *catch-all* que atende todo o `/api/*`.

A instância do Nest é criada uma vez e reaproveitada pelas invocações seguintes da mesma
função, o que mantém a conexão com o banco aberta e derruba a latência após a primeira chamada.

> Como o backend é um servidor Node comum via `main.ts`, ele também roda sem alterações em
> Render, Railway ou Fly.io — basta usar `npm run build` e `npm run start:prod`.

## 📁 Estrutura de pastas

```
QueroKafe/
├── apps/
│   ├── api/                      # Backend NestJS
│   │   ├── api/                  # Função serverless da Vercel (rota catch-all)
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Modelo de dados
│   │   │   ├── migrations/       # Histórico de migrations
│   │   │   └── seed.ts           # Dados de exemplo
│   │   ├── vercel.json           # Deploy do backend
│   │   └── src/
│   │       ├── coffees/          # CRUD de cafés + filtros
│   │       ├── roasters/         # CRUD de torrefações
│   │       ├── flavor-notes/     # CRUD de notas sensoriais
│   │       ├── brew-methods/     # CRUD de métodos de preparo
│   │       ├── prisma/           # PrismaService (conexão)
│   │       ├── health/           # Health check
│   │       ├── app.factory.ts    # CORS, validação e Swagger (compartilhado)
│   │       └── main.ts           # Servidor local
│   │
│   └── web/                      # Frontend Next.js
│       ├── vercel.json           # Deploy do frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx          # Catálogo com filtros
│           │   ├── cafes/[slug]/     # Detalhe do café
│           │   ├── torrefacoes/      # Torrefações parceiras
│           │   └── admin/            # Painel CRUD + Server Actions
│           ├── components/           # Componentes de UI
│           └── lib/                  # Cliente da API, tipos e formatadores
│
└── package.json                  # Workspaces e scripts
```

---

Projeto acadêmico desenvolvido para a disciplina de desenvolvimento web.
