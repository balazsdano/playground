import { Memory } from "@mastra/memory";

export const sharedMemory = new Memory({
  options: {
    lastMessages: 100,
  },
});

export const testResource = "test-user";
export const testThread = "test-thread";
