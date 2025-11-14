import { MastraClient, type WorkflowRunResult } from "@mastra/client-js";
import { Message } from "./types.js";
import { approach, testResource, testThread } from "../config.js";

const mastraClient = new MastraClient({
  baseUrl: "http://localhost:4111",
});

export function sendMessage(
  previousMessages: Message[],
  newUserMessage: Message,
) {
  switch (approach) {
    case "singleAgent":
      return sendMessageToSingleAgent(previousMessages, newUserMessage);
    case "singleLearningAgent":
      return sendMessageToSingleLearningAgent(previousMessages, newUserMessage);
    case "agentNetwork":
      return sendMessageToAgentNetwork(previousMessages, newUserMessage);
    case "multiStepWorkflow":
      return sendMessageToMultiStepWorkflow(previousMessages, newUserMessage);
    default:
      throw new Error(`Unknown approach: ${approach}`);
  }
}

async function sendMessageToSingleAgent(
  previousMessages: Message[],
  newUserMessage: Message,
): Promise<string> {
  const agent = mastraClient.getAgent("singleAgent");
  if (!agent) {
    throw new Error("singleAgent not found");
  }

  const response = await agent.generate(newUserMessage.content, {
    memory: {
      resource: testResource,
      thread: testThread,
    },
  });
  return response.text;
}

async function sendMessageToSingleLearningAgent(
  previousMessages: Message[],
  newUserMessage: Message,
): Promise<string> {
  const agent = mastraClient.getAgent("singleLearningAgent");
  if (!agent) {
    throw new Error("singleLearningAgent not found");
  }

  const response = await agent.generate(newUserMessage.content, {
    memory: {
      resource: testResource,
      thread: testThread,
    },
  });
  return response.text;
}

async function sendMessageToAgentNetwork(
  previousMessages: Message[],
  newUserMessage: Message,
): Promise<string> {
  const agent = mastraClient.getAgent("supervisorAgent");
  if (!agent) {
    throw new Error("supervisorAgent not found");
  }

  const response = await agent.generate(newUserMessage.content, {
    memory: {
      resource: testResource,
      thread: testThread,
    },
  });
  return response.text;
}

// https://mastra.ai/reference/client-js/workflows
// https://mastra.ai/docs/workflows/human-in-the-loop#multi-turn-human-input
async function sendMessageToMultiStepWorkflow(
  previousMessages: Message[],
  newUserMessage: Message,
): Promise<string> {
  const workflow = mastraClient.getWorkflow("multiStepWorkflow");
  if (!workflow) {
    throw new Error("multiStepWorkflow not found");
  }

  const run = await workflow.createRunAsync({ runId: testThread });
  const execution = await workflow.runExecutionResult(testThread);

  switch (execution.status) {
    case "suspended":
      const suspendedStepID = Object.keys(execution.steps).find(
        (stepID) => execution.steps[stepID].status === "suspended",
      );
      const resumeResult = await run.resumeAsync({
        step: suspendedStepID!,
        resumeData: { userMessage: newUserMessage.content },
      });
      return processWorkflowRunResult(resumeResult);
    default:
      const startResult = await run.startAsync({
        inputData: {
          userMessage: newUserMessage.content,
        },
      });

      return processWorkflowRunResult(startResult);
  }
}

function processWorkflowRunResult(runResult: WorkflowRunResult) {
  switch (runResult.status) {
    case "suspended":
      console.log("runResult suspended:", runResult);
      // Mastra backend returns `suspended: string[][]`
      const suspendedStepID = runResult.suspended[0][0];
      const suspendedStep = runResult.steps[suspendedStepID];
      const suspendPayload = suspendedStep.suspendPayload;
      return suspendPayload.aiMessage;
    case "success":
      console.log("runResult success:", runResult);
      return "runResult success";
    case "failed":
      console.log("runResult failed:", runResult);
      return "runResult failed";
    default:
      console.log("runResult other:", runResult);
      return "runResult other";
  }
}
