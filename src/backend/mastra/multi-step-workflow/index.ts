import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { multiStepWorkflow } from "./multiStepWorkflow.js";
import { requirementsAgent } from "./requirementsAgentStep.js";
import { presentationAgent } from "./presentationAgentStep.js";
import { quizAgent } from "./quizAgentStep.js";
import { generalistAgent } from "./generalistAgentStep.js";

export function createMastraWithMultiStepWorkflow() {
  return new Mastra({
    agents: {
      requirementsAgent,
      presentationAgent,
      quizAgent,
      generalistAgent,
    },
    workflows: { multiStepWorkflow },
    storage: new LibSQLStore({ url: ":memory:" }),
    observability: { default: { enabled: true } },
  });
}
