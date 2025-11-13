import { MastraClient } from "@mastra/client-js";
import { Message } from "./types.js";
import { approach } from "../config.js";

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

  const response = await agent.generate(newUserMessage.content);
  return response.text;
}
