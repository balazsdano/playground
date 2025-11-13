import { Agent } from "@mastra/core/agent";
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { sharedMemory, testResource, testThread } from "./sharedMemory.js";
import { requirementsAgentStepOutputSchema } from "./requirementsAgentStep.js";

const quizAgentOutputSchema = z.object({
  message: z.string().describe("Your message to the user"),
  done: z
    .boolean()
    .describe(
      "Whether user has approved your latest content proposal and you consider your work done. If still waiting for user feedback, return false.",
    ),
  contentHTML: z
    .string()
    .describe("Your content proposal as simple HTML format."),
});

export const quizAgent = new Agent({
  id: "quizAgent",
  name: "quizAgent",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
  instructions: `
  Create a quiz in simple markdown format, to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the quiz.
  Use only html, no css, no js.
  Make it as concise as possible.

  After proposing quiz content html, wait for user feedback and approval, before you consider your work done.
  If user points out issues or asks for changes, make updated proposal, and wait for user feedback again.
  `,
});

export const quizAgentStep = createStep({
  id: "quizAgentStep",
  inputSchema: requirementsAgentStepOutputSchema,
  suspendSchema: z.object({
    aiMessage: z.string(),
  }),
  resumeSchema: z.object({
    userMessage: z.string(),
  }),
  outputSchema: z.object({
    contentHTML: z.string(),
  }),
  execute: async ({ inputData, resumeData, suspend, mastra }) => {
    const agent = mastra.getAgent("quizAgent");
    if (!agent) {
      throw new Error("quizAgent not found");
    }

    const agentResponse = await agent.generate(
      resumeData?.userMessage ??
        `Create a quiz to meet the following requirements:
<requirements>
${inputData.requirements}
</requirements>`,
      {
        memory: { resource: testResource, thread: testThread },
        structuredOutput: {
          schema: quizAgentOutputSchema,
        },
      },
    );

    if (!agentResponse.object.done) {
      return await suspend({ aiMessage: agentResponse.object.message });
    }

    return {
      contentHTML: agentResponse.object.contentHTML,
    };
  },
});
