import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * O Supabase (e provedores semelhantes) expõe dois endereços:
 *
 * - pooler (Supavisor): usado pela API em runtime, suporta muitas conexões curtas;
 * - conexão direta: exigida pelas migrations, que executam DDL e transações longas.
 *
 * Por isso o CLI do Prisma usa DIRECT_URL quando ela existe, caindo para DATABASE_URL
 * em bancos que oferecem um único endereço.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
