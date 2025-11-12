import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { singleAgent } from "./singleAgent.js";
import { getDBURL } from "../utils/getDBURL.js";

export function createMastraWithSingleAgent() {
  return new Mastra({
    agents: { singleAgent },
    storage: new LibSQLStore({ url: ":memory:" }),
    observability: { default: { enabled: true } },
  });
}
