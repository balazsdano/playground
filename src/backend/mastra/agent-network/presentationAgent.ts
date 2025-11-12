import { Agent } from "@mastra/core/agent";

export const presentationAgent = new Agent({
  id: "presentationAgent",
  name: "presentationAgent",
  description: "This agent specializes in creating presentations.",
  model: "openai/gpt-4o-mini",
  instructions: `
  Create a presentation in simple html format, to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the presentation.
  Use only html, no css, no js.
  Make it as concise as possible.
  `,
});
