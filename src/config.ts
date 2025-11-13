export type Approach =
  | "singleAgent"
  | "singleLearningAgent"
  | "agentNetwork"
  | "multiStepWorkflow";

export const approach: Approach = "agentNetwork";
export const testResource = "test-user";
export const testThread = "test-thread";
