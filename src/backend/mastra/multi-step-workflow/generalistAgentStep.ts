import { Agent } from "@mastra/core/agent";
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { sharedMemory, testResource, testThread } from "./sharedMemory.js";
import { requirementsAgentStepOutputSchema } from "./requirementsAgentStep.js";

const generalistAgentOutputSchema = z.object({
  message: z
    .string()
    .describe(
      "Your message to the user. Do not duplicate the `contentHTML` here.",
    ),
  done: z
    .boolean()
    .describe(
      "Whether user has approved your latest content proposal and you consider your work done. If still waiting for user feedback, return false.",
    ),
  contentHTML: z
    .string()
    .describe("Your content proposal as simple HTML format."),
});

export const generalistAgent = new Agent({
  id: "generalistAgent",
  name: "generalistAgent",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
  instructions: `
  Create digital content to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the content.
  Use some simple format, e.g. html (with no css and no js), markdown, etc.
  Make it as concise as possible.

  After proposing content html, wait for user feedback and approval, before you consider your work done.
  If user points out issues or asks for changes, make updated proposal, and wait for user feedback again.
  `,
});

export const generalistAgentStep = createStep({
  id: "generalistAgentStep",
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
    const generalistAgent = mastra.getAgent("generalistAgent");
    if (!generalistAgent) {
      throw new Error("generalistAgent not found");
    }

    const agentResponse = await generalistAgent.generate(
      resumeData?.userMessage ??
        `Create content to meet the following requirements:
<requirements>
${inputData.requirements}
</requirements>`,
      {
        memory: { resource: testResource, thread: testThread },
        structuredOutput: {
          schema: generalistAgentOutputSchema,
        },
      },
    );

    if (!agentResponse.object.done) {
      return await suspend({
        aiMessage:
          agentResponse.object.message +
          "\n" +
          agentResponse.object.contentHTML,
      });
    }

    return {
      contentHTML: agentResponse.object.contentHTML,
    };
  },
});
