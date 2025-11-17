import { Agent } from "@mastra/core/agent";
import { aiModel } from "../../../config.js";

export const quizAgent = new Agent({
  id: "quizAgent",
  name: "quizAgent",
  description: "This agent specializes in creating quizzes.",
  model: aiModel,
  instructions: `
  Create a quiz in simple markdown format, to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the quiz.
  Make it as concise as possible.
  `,
});
