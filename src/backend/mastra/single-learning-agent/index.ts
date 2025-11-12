import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { singleLearningAgent } from "./singleLearningAgent.js";
import { getDBURL } from "../utils/getDBURL.js";

export function createMastraWithSingleLearningAgent() {
  return new Mastra({
    agents: { singleLearningAgent },
    storage: new LibSQLStore({ url: ":memory:" }),
    observability: { default: { enabled: true } },
  });
}
