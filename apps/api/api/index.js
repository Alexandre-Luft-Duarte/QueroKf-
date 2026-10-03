/**
 * Ponto de entrada da API na Vercel.
 *
 * A Vercel não mantém um servidor ligado: cada requisição invoca esta função. Por isso
 * o Nest é inicializado uma única vez por instância (ver getServerlessHandler) e o
 * Express resultante atende as chamadas seguintes sem custo de bootstrap.
 *
 * Todo o /api/* chega aqui pelo rewrite do vercel.json, com a URL original preservada,
 * que é o que o prefixo global /api do Nest espera. Uma rota catch-all no nome do
 * arquivo (api/[[...slug]].js) não serve: fora do Next.js a Vercel só casa um segmento
 * com ela, e /api/coffees/:slug caía no 404 da plataforma.
 *
 * Importa de dist/ (compilado por `nest build`) e não do TypeScript direto, porque o
 * bundler da Vercel não emite os metadados de decorator que a injeção de dependência
 * do Nest precisa.
 */
import { getServerlessHandler } from '../dist/app.factory.js';

export default async function handler(req, res) {
  const server = await getServerlessHandler();

  return server(req, res);
}
