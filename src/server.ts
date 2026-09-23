import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { registeredTools } from './tools/registry.js';
import { ToolHandler } from './core/tool-handler.js';

/**
 * ツールを登録済みのMCPサーバーを生成する（stdio・HTTPの両方で共用）
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: 'zaim-api-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );
  const toolHandler = new ToolHandler();

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: registeredTools,
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      return await toolHandler.executeTool(name, args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }

      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  server.onerror = (error) => {
    console.error('[MCP Error]', error);
  };

  return server;
}
