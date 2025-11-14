import { Agent } from "@mastra/core/agent";
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { sharedMemory, testResource, testThread } from "./sharedMemory.js";

const requirementsAgentOutputSchema = z.object({
  message: z.string().describe("Your message to the user"),
  keyRequirementsClear: z
    .boolean()
    .describe("Whether key requirements are already clear."),
  contentFormat: z
    .union([z.literal("presentation"), z.literal("quiz"), z.literal("other")])
    .describe(
      "Content format that the user requires. If you are not sure yet, then leave it empty.",
    ),
  requirements: z
    .string()
    .describe(
      "Requirements in simple short well-documented format, including key requirements and any additional info the user shared. If key requirements are not clear yet, then leave it empty.",
    ),
});

export const requirementsAgent = new Agent({
  id: "requirementsAgent",
  name: "requirementsAgent",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
  instructions: `
  Act as project manager in a creative digital agency.

  ## Creative digital agency
  - The agency helps customers design & create digital content, e.g.: presentation, quiz, social media post, etc.
  - Communicate with customers via messages, mostly text and sometimes images and documents.
  - Agency team structure:
    - Project manager: Manages conversation with customer, and manages work with creative team.
    - Creative team: Team of creators, with broad skillset in writing and designing digital content.

  ## Your role
  You are project manager.

  ## Your workflow
  1. Receive customer's initial message for new project. And have brief initial conversation to clarify key requirements (e.g. content format, topic, use case and target audience, preferred style, etc).
  2. When key requirements are clear, write them into a simple short well-documented format.

  After you are done with collecting the requirements, the creative team will take over to create the content.

  ## Kickoff document
  It should contain key project requirements + any additional info that the user provided or you collected during your initial conversation.

  Key project requirements e.g.:
  - Content format e.g.: ppt presentation, quiz pdf, social media post, etc.
  - Topic
  - Use case and target audience
  - Etc. you can be creative about collecting other requirements

  Additional info e.g.:
  - Source material e.g.: user uploaded files, website urls, etc.
  - Preferred length, style, tone, etc.
  - Etc.
  `,
});

export const requirementsAgentStepOutputSchema = z.object({
  contentFormat: z.union([
    z.literal("presentation"),
    z.literal("quiz"),
    z.literal("other"),
  ]),
  requirements: z.string(),
});

export const requirementsAgentStep = createStep({
  id: "requirementsAgentStep",
  inputSchema: z.object({
    userMessage: z.string(),
  }),
  suspendSchema: z.object({
    aiMessage: z.string(),
  }),
  resumeSchema: z.object({
    userMessage: z.string(),
  }),
  outputSchema: requirementsAgentStepOutputSchema,
  execute: async ({ inputData, resumeData, suspend, mastra }) => {
    const agent = mastra.getAgent("requirementsAgent");
    if (!agent) {
      throw new Error("requirementsAgent not found");
    }

    const agentResponse = await agent.generate(
      resumeData?.userMessage ?? inputData.userMessage,
      {
        memory: { resource: testResource, thread: testThread },
        structuredOutput: {
          schema: requirementsAgentOutputSchema,
        },
      },
    );

    if (!agentResponse.object.keyRequirementsClear) {
      return await suspend({ aiMessage: agentResponse.object.message });
    }

    return {
      contentFormat: agentResponse.object.contentFormat,
      requirements: agentResponse.object.requirements,
    };
  },
});
