import { Agent } from "@mastra/core/agent";
import { aiModel } from "../../../config.js";

export const generalistAgent = new Agent({
  id: "generalistAgent",
  name: "generalistAgent",
  description:
    "This agent does not have a specific specialization, is rather a good generalist. While not as excellent at a specific content format as a specialist would be, still does a good enough job.",
  model: aiModel,
  instructions: `
  Create digital content to meet user's requirements.
  If some requirement is not clear, ask clarifying questions. Then wait for user response before proceeding to creating the content.
  Use some simple format, e.g. html (with no css and no js), markdown, etc.
  Make it as concise as possible.

  You don't have skills and tools to create media (e.g. images, videos, audio). If you get such request, politely reject it, and explain your limitations.
  `,
});
