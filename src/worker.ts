import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createServer } from './server.js';

interface Env {
  /** URLパスに含める共有シークレット。知っている人だけが接続できる */
  MCP_SECRET: string;
}

/**
 * Cloudflare Workers 用エントリーポイント
 * https://<worker>.workers.dev/mcp/<MCP_SECRET> で Streamable HTTP を受け付ける
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // ponytail: URLパスの共有シークレットのみで保護。複数人で使うならOAuth認可を導入する
    if (!env.MCP_SECRET || new URL(request.url).pathname !== `/mcp/${env.MCP_SECRET}`) {
      return new Response('Not Found', { status: 404 });
    }

    // ステートレス運用のためリクエストごとにサーバーとトランスポートを生成する
    const server = createServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    return transport.handleRequest(request);
  },
};
