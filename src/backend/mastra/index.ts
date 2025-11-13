import { approach } from "../../config.js";
import { createMastraWithAgentNetwork } from "./agent-network/index.js";
import { createMastraWithMultiStepWorkflow } from "./multi-step-workflow/index.js";
import { createMastraWithSingleAgent } from "./single-agent/index.js";
import { createMastraWithSingleLearningAgent } from "./single-learning-agent/index.js";

function createMastra() {
  switch (approach) {
    case "singleAgent":
      return createMastraWithSingleAgent();
    case "singleLearningAgent":
      return createMastraWithSingleLearningAgent();
    case "agentNetwork":
      return createMastraWithAgentNetwork();
    case "multiStepWorkflow":
      return createMastraWithMultiStepWorkflow();
    default:
      throw new Error(`Unknown approach: ${approach}`);
  }
}
export const mastra = createMastra();
