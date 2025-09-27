#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuration interface
interface GeminiConfig {
  apiKey: string;
  model: string;
}

class GeminiMCPServer {
  private server: Server;
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(config: GeminiConfig) {
    this.server = new Server(
      {
        name: "gemini-pro-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Gemini AI
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.model });

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // Register available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "generate_text",
            description: "Generate text using Gemini 2.5 Pro model",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description: "The text prompt to send to Gemini",
                },
                maxTokens: {
                  type: "number",
                  description: "Maximum number of tokens to generate (optional)",
                  default: 1000,
                },
                temperature: {
                  type: "number",
                  description: "Temperature for text generation (0.0 to 2.0)",
                  default: 1.0,
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "analyze_image",
            description: "Analyze an image using Gemini 2.5 Pro Vision",
            inputSchema: {
              type: "object",
              properties: {
                imageData: {
                  type: "string",
                  description: "Base64 encoded image data",
                },
                prompt: {
                  type: "string",
                  description: "Text prompt to describe what to analyze in the image",
                  default: "Describe this image",
                },
              },
              required: ["imageData"],
            },
          },
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "generate_text":
            return await this.handleTextGeneration(args);
          case "analyze_image":
            return await this.handleImageAnalysis(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleTextGeneration(args: any) {
    const { prompt, temperature = 1.0 } = args;

    const generationConfig = {
      temperature: Math.max(0, Math.min(2, temperature)),
      maxOutputTokens: args.maxTokens || 1000,
    };

    const result = await this.model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    return {
      content: [
        {
          type: "text",
          text: text,
        },
      ],
    };
  }

  private async handleImageAnalysis(args: any) {
    const { imageData, prompt = "Describe this image" } = args;

    // Convert base64 to proper format for Gemini
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg", // Adjust based on your needs
      },
    };

    const result = await this.model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, imagePart],
        },
      ],
    });

    const response = result.response;
    const text = response.text();

    return {
      content: [
        {
          type: "text",
          text: text,
        },
      ],
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Gemini 2.5 Pro MCP server running on stdio");
  }
}

// Main execution
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is required");
    process.exit(1);
  }

  const config: GeminiConfig = {
    apiKey,
    model: "gemini-2.5-pro-exp-03-25", // Updated to use the specific model you requested
  };

  const server = new GeminiMCPServer(config);
  await server.run();
}

// Error handling for the main function
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
