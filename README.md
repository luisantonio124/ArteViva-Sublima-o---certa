# ArteViva Sublimação

Projeto inicial utilizando [Next.js 14](https://nextjs.org/), TypeScript, Tailwind CSS, shadcn/ui e Prisma com PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste a variável `DATABASE_URL` conforme seu banco:

   ```bash
   cp .env.example .env
   ```

2. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

3. Popule o banco com dados fictícios:

   ```bash
   npm run seed
   # ou
   npx prisma db seed
   ```

## Ambiente de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`.
