# Test Your Gemini MCP Server

## Step 1: Get your Gemini API Key
Go to: https://aistudio.google.com/app/apikey
Create a new API key and copy it.

## Step 2: Test the connection
Run these commands in your terminal:

cd ~/Documents/gemini-mcp-server
export GEMINI_API_KEY="paste-your-api-key-here"
node test-connection.mjs

## Step 3: Test the MCP server
If the connection test passes, test the MCP server:

echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | GEMINI_API_KEY="your-api-key" node dist/index.js

## Step 4: Check Claude Desktop config
Make sure your Claude Desktop config is at:
~/Library/Application Support/Claude/claude_desktop_config.json

With content:
{
  "mcpServers": {
    "gemini-pro": {
      "command": "node",
      "args": ["/Users/luis_ticas/Documents/gemini-mcp-server/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-actual-api-key-here"
      }
    }
  }
}

