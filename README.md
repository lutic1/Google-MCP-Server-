# Gemini Pro MCP Server

MCP server for integrating Gemini Pro API with Claude Desktop.

<a href="https://glama.ai/mcp/servers/@lutic1/Google-MCP-Server-">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@lutic1/Google-MCP-Server-/badge" alt="Gemini Pro Server MCP server" />
</a>

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

3. **Set up environment variable:**
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Configure Claude Desktop:**
   
   Edit your Claude Desktop config file:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`
   
   Add this configuration:
   ```json
   {
     "mcpServers": {
       "gemini-pro": {
         "command": "node",
         "args": ["/Users/luis_ticas/Documents/gemini-mcp-server/dist/index.js"],
         "env": {
           "GEMINI_API_KEY": "your-gemini-api-key-here"
         }
       }
     }
   }
   ```

6. **Restart Claude Desktop**

## Available Tools

- **generate_text**: Generate text using Gemini Pro
- **analyze_image**: Analyze images using Gemini Pro Vision

## Usage

Once connected, you can use commands like:
- "Generate text using Gemini about [topic]"
- "Analyze this image using Gemini"