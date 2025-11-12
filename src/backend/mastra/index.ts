import { createMastraWithSingleAgent } from "./single-agent/index.js";
import { createMastraWithSingleLearningAgent } from "./single-learning-agent/index.js";

export const mastra = createMastraWithSingleLearningAgent();
