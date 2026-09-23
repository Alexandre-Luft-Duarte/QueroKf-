/**
 * Ponto de entrada da API na Vercel.
 *
 * A Vercel não mantém um servidor ligado: cada requisição invoca esta função. Por isso
 * o Nest é inicializado uma única vez por instância (ver getServerlessHandler) e o
 * Express resultante atende as chamadas seguintes sem custo de bootstrap.
 *
 * O nome do arquivo é uma rota "catch-all": /api, /api/coffees, /api/docs — todas caem
 * aqui com a URL original preservada, que é o que o prefixo global /api do Nest espera.
 *
 * Importa de dist/ (compilado por `nest build`) e não do TypeScript direto, porque o
 * bundler da Vercel não emite os metadados de decorator que a injeção de dependência
 * do Nest precisa.
 */
import { getServerlessHandler } from '../dist/app.factory.js';

const ehParametroDaPlataforma = (chave) => chave.startsWith('[');

/**
 * A Vercel entrega o parâmetro da rota dinâmica de duas formas: anexado à query string
 * (`?[...slug]=coffees`) e já parseado em `req.query`. Como o ValidationPipe roda com
 * `forbidNonWhitelisted`, esse campo extra faz qualquer requisição com DTO de query
 * falhar com 400 — então as duas precisam ser limpas.
 *
 * Limpar apenas a URL não resolve: o `req.query` gravado pela plataforma é uma
 * propriedade própria do objeto e sobrepõe o getter do Express que reparseia a URL.
 */
function stripVercelRouteParams(req) {
  const [path, queryString] = req.url.split('?');

  if (queryString) {
    const params = new URLSearchParams(queryString);

    for (const chave of [...params.keys()]) {
      if (ehParametroDaPlataforma(chave)) {
        params.delete(chave);
      }
    }

    const limpa = params.toString();
    req.url = limpa ? path + '?' + limpa : path;
  }

  if (req.query && typeof req.query === 'object') {
    for (const chave of Object.keys(req.query)) {
      if (ehParametroDaPlataforma(chave)) {
        delete req.query[chave];
      }
    }
  }
}

export default async function handler(req, res) {
  stripVercelRouteParams(req);

  const server = await getServerlessHandler();

  return server(req, res);
}
