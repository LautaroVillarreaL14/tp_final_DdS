import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { registerToolSet } from "./tool-factory";
import allTools from "./tools/index";
import { api } from "./api-client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localEnv = path.resolve(__dirname, "..", ".env");
dotenv.config({ path: localEnv });

if (!process.env.API_C_EMAIL || !process.env.API_C_PASSWORD) {
  const backEnv = path.resolve(__dirname, "..", "..", "back", ".env");
  dotenv.config({ path: backEnv });
}

const server = new McpServer(
  { name: "api-c-bridge", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

registerToolSet(server, allTools);

async function main() {
  const authed = await api.autoLogin();
  if (authed) console.error("[api-c-bridge] Auto-login exitoso");
  else console.error("[api-c-bridge] Sin credenciales env, esperando auth_login manual");

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
