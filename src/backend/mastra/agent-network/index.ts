import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { supervisorAgent } from "./supervisorAgent.js";

export function createMastraWithAgentNetwork() {
  return new Mastra({
    agents: { supervisorAgent },
    storage: new LibSQLStore({ url: ":memory:" }),
    observability: { default: { enabled: true } },
  });
}
