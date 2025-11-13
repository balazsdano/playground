import { createMastraWithAgentNetwork } from "./agent-network/index.js";
import { createMastraWithMultiStepWorkflow } from "./multi-step-workflow/index.js";
import { createMastraWithSingleAgent } from "./single-agent/index.js";
import { createMastraWithSingleLearningAgent } from "./single-learning-agent/index.js";

export const mastra = createMastraWithMultiStepWorkflow();
