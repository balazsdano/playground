import { MastraClient } from "@mastra/client-js";
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
    default:
      throw new Error("not yet");
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
