import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { RunnableConfig } from "@langchain/core/runnables";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { AIMessageText } from "@/components/message";
import { SearchLoading } from "@/components/ui/search";

export const searchTool = new DynamicStructuredTool({
  name: "WebSearchTool",
  description: `Use this tool to search the web for up-to-date, real-time information using the Tavily Search API.
It returns the most relevant result based on the provided search query.

You should call this tool when:
- The user asks about current news or trending topics
- The user wants recent data not likely found in your existing knowledge
- The user is looking for public facts, websites, or updated info
- You need help answering something you are unsure about or is time-sensitive

Examples of when to use:
- "What’s the latest on the Apple iPhone release?"
- "Search recent breakthroughs in AI"
- "Find information about the 2025 Mars mission"
- "What are people saying about the new Zelda game?"

The tool responds with a short text summary of the top web result.`,
  schema: z.object({
    input: z
      .string()
      .describe("The search query to find relevant information."),
  }),
  func: async ({ input }, _, config?: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <SearchLoading />,
          type: "append",
        },
      },
      config,
    );

    const tavilySearch = new TavilySearchResults({ maxResults: 1 });
    const result = await tavilySearch.invoke(input);

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <AIMessageText content={JSON.parse(result)[0].content} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify(result, null);
  },
});
