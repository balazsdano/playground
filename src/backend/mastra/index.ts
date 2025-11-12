import { createMastraWithAgentNetwork } from "./agent-network/index.js";
import { createMastraWithSingleAgent } from "./single-agent/index.js";
import { createMastraWithSingleLearningAgent } from "./single-learning-agent/index.js";

export const mastra = createMastraWithAgentNetwork();
