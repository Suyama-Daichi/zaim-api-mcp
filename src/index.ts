#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const server = createServer();

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  await server.connect(new StdioServerTransport());
  console.error('Zaim API MCP Server started');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
