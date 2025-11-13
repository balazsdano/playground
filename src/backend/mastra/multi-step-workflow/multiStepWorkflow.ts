import { createWorkflow } from "@mastra/core";
import { z } from "zod";
import { requirementsAgentStep } from "./requirementsAgentStep.js";
import { presentationAgentStep } from "./presentationAgentStep.js";
import { quizAgentStep } from "./quizAgentStep.js";
import { generalistAgentStep } from "./generalistAgentStep.js";

export const multiStepWorkflow = createWorkflow({
  id: "multiStepWorkflow",
  inputSchema: z.object({
    userMessage: z.string(),
  }),
  outputSchema: z.object({
    contentHTML: z.string(),
  }),
})
  .then(requirementsAgentStep)
  .branch([
    [
      async ({ inputData: { contentFormat } }) =>
        contentFormat === "presentation",
      presentationAgentStep,
    ],
    [
      async ({ inputData: { contentFormat } }) => contentFormat === "quiz",
      quizAgentStep,
    ],
    [
      async ({ inputData: { contentFormat } }) => contentFormat === "other",
      generalistAgentStep,
    ],
  ])
  .commit();
