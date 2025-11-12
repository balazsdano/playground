import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

export const quizAgent = new Agent({
  id: "quizAgent",
  name: "quizAgent",
  description: "This agent specializes in creating quizzes.",
  model: "openai/gpt-4o-mini",
  instructions: `
  Create a quiz in simple markdown format, to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the quiz.
  Make it as concise as possible.
  `,
});
