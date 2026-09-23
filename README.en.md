# Zaim API MCP Server

[日本語 README](README.md)

An MCP (Model Context Protocol) server for the Zaim API. It uses OAuth 1.0a authentication to read and manage household budget data in Zaim.

## Features

- Integration with the Zaim API (OAuth 1.0a)
- 14 tools
- Create, read, update, and delete money records
- Master data retrieval (categories, genres, accounts, currencies)
- Type-safe TypeScript implementation
- Strict input validation with Zod schemas
- Test suite (134 tests)
- Docker support

## Available Tools

### Authentication & User Info
- `zaim_check_auth_status` - Check authentication status
- `zaim_get_user_info` - Get user information

### Money Records
- `zaim_get_money_records` - Get money records (with filtering and pagination)
- `zaim_create_payment` - Create a payment record
- `zaim_create_income` - Create an income record
- `zaim_create_transfer` - Create a transfer record
- `zaim_update_money_record` - Update an existing record
- `zaim_delete_money_record` - Delete a record

### Master Data
- `zaim_get_user_categories` - List user categories
- `zaim_get_user_genres` - List user genres
- `zaim_get_user_accounts` - List user accounts
- `zaim_get_default_categories` - List default categories
- `zaim_get_default_genres` - List default genres
- `zaim_get_currencies` - List available currencies

## Requirements

- Docker (recommended)
- Node.js 22+ (for local development)
- Zaim API OAuth credentials
  - Consumer Key
  - Consumer Secret
  - Access Token
  - Access Token Secret

## Environment Variables

```bash
# Required: Zaim API credentials
ZAIM_CONSUMER_KEY=your_consumer_key
ZAIM_CONSUMER_SECRET=your_consumer_secret
ZAIM_ACCESS_TOKEN=your_access_token
ZAIM_ACCESS_TOKEN_SECRET=your_access_token_secret
```

## Installation

### Using Docker (recommended)

```bash
# Clone the repository
git clone https://github.com/Suyama-Daichi/zaim-api-mcp.git
cd zaim-api-mcp

# Build the Docker image
docker build -t zaim-api-mcp .
```

### Local Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Claude Desktop Configuration

### 1. Configuration file location

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### 2. Docker (recommended)

```json
{
  "mcpServers": {
    "zaim-api": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e", "ZAIM_CONSUMER_KEY",
        "-e", "ZAIM_CONSUMER_SECRET",
        "-e", "ZAIM_ACCESS_TOKEN",
        "-e", "ZAIM_ACCESS_TOKEN_SECRET",
        "zaim-api-mcp"
      ],
      "env": {
        "ZAIM_CONSUMER_KEY": "your_consumer_key",
        "ZAIM_CONSUMER_SECRET": "your_consumer_secret",
        "ZAIM_ACCESS_TOKEN": "your_access_token",
        "ZAIM_ACCESS_TOKEN_SECRET": "your_access_token_secret"
      }
    }
  }
}
```

When `-e` is given only a variable name, Docker passes the value from the launching process's environment (here, the values in `env`) into the container. This keeps credentials out of the command-line arguments, which is safer than `-e KEY=value`.

### 3. Local build

```json
{
  "mcpServers": {
    "zaim-api": {
      "command": "node",
      "args": ["/path/to/zaim-api-mcp/dist/index.js"],
      "env": {
        "ZAIM_CONSUMER_KEY": "your_consumer_key",
        "ZAIM_CONSUMER_SECRET": "your_consumer_secret",
        "ZAIM_ACCESS_TOKEN": "your_access_token",
        "ZAIM_ACCESS_TOKEN_SECRET": "your_access_token_secret"
      }
    }
  }
}
```

## Usage Examples

### Check authentication status
```
Use zaim_check_auth_status to check that authentication is configured correctly
```

### Get money records
```
Use zaim_get_money_records to get payment records for January 2024
```

### Record a payment
```
Use zaim_create_payment to record a 1,500 yen lunch today in the food category
```

### List categories
```
Use zaim_get_user_categories to show the available categories
```

## Limitations

- The Zaim API has a rate limit of 60 requests per minute, but this server does not throttle requests or retry automatically
- Configuration is by environment variables (credentials) only; there is no configuration file for timeouts or other settings

## Project Structure

```
zaim-api-mcp/
├── src/
│   ├── core/              # MCP server core
│   │   ├── tool-handler.ts
│   │   └── zaim-api-client.ts
│   ├── tools/             # Tool implementations
│   │   ├── auth/          # Authentication tools
│   │   ├── money/         # Money record tools
│   │   ├── master/        # Master data tools
│   │   └── registry.ts    # Tool registry
│   ├── types/             # Type definitions
│   ├── utils/             # Utilities
│   └── index.ts           # Entry point
├── tests/                 # Tests
├── Dockerfile             # Production image (multi-stage, runs as non-root user)
└── docker-compose.yml     # Docker configuration
```

## Available Scripts

```bash
npm run build          # Build TypeScript
npm run start          # Start production server
npm run dev            # Start development server
npm run lint           # Run ESLint
npm run typecheck      # Type check
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Coverage report
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
npm run docker:dev     # Start with Docker Compose
```

## Troubleshooting

### Authentication errors
- Check that the environment variables are set correctly
- Check your application settings on the Zaim developer site
- Check whether your access token is still valid

### Docker
- Check that the Docker daemon is running
- Check that the environment variables are passed to the container
- Check the logs for detailed error messages

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Zaim API documentation](https://dev.zaim.net/)
- [MCP specification](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
