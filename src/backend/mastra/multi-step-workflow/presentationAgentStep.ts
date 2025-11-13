import { Agent } from "@mastra/core/agent";
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { sharedMemory, testResource, testThread } from "./sharedMemory.js";
import { requirementsAgentStepOutputSchema } from "./requirementsAgentStep.js";

const presentationAgentOutputSchema = z.object({
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

export const presentationAgent = new Agent({
  id: "presentationAgent",
  name: "presentationAgent",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
  instructions: `
  Create a presentation in simple html format, to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the presentation.
  Use only html, no css, no js.
  Make it as concise as possible.

  After proposing presentation content html, wait for user feedback and approval, before you consider your work done.
  If user points out issues or asks for changes, make updated proposal, and wait for user feedback again.
  `,
});

export const presentationAgentStep = createStep({
  id: "presentationAgentStep",
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
    const agent = mastra.getAgent("presentationAgent");
    if (!agent) {
      throw new Error("presentationAgent not found");
    }

    const agentResponse = await agent.generate(
      resumeData?.userMessage ??
        `Create a presentation to meet the following requirements:
<requirements>
${inputData.requirements}
</requirements>`,
      {
        memory: { resource: testResource, thread: testThread },
        structuredOutput: {
          schema: presentationAgentOutputSchema,
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
