import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { presentationAgent } from "./presentationAgent.js";
import { quizAgent } from "./quizAgent.js";
import { generalistAgent } from "./generalistAgent.js";
import { aiModel } from "../../../config.js";

export const supervisorAgent = new Agent({
  id: "supervisorAgent",
  name: "supervisorAgent",
  model: aiModel,
  memory: new Memory({
    options: {
      lastMessages: 100,
    },
  }),
  agents: {
    presentationAgent,
    quizAgent,
    generalistAgent,
  },
  instructions: `
  You are a network of digital content creators.
  The user will ask you to create some digital content, e.g. presentation, quiz, etc.

  Start by discussing key requirements with the user: topic, use case, target audience, content format.
  When key requirements are clear, delegate the creative work to the most suitable creator agent in your network.
  **Make sure to delegate the actual creative work to a creator agent. Because they have the specific skills for this creative work.**
  `,
});
