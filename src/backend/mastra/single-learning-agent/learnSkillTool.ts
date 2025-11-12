import { createTool } from "@mastra/core";
import { z } from "zod";

export const learnSkillTool = createTool({
  id: "learn-skill-tool",
  description: "Learn creative design skill e.g. quiz, presentation.",
  inputSchema: z.object({
    creativeSkill: z.union([z.literal("quiz"), z.literal("presentation")]),
  }),
  outputSchema: z.object({
    practicalTips: z.string(),
  }),
  execute: async ({ context }) => {
    switch (context.creativeSkill) {
      case "presentation":
        return {
          practicalTips:
            "Start by writing brief outline, then add detailed content and styling.",
        };
      case "quiz":
        return {
          practicalTips:
            "Start by listing topic of questions. Then write actual questions.",
        };
    }
  },
});
