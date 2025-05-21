import { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch/web";
import { z } from "zod";
import { CUSTOM_EVENT_NAME } from "@/app/server";
import { Weather, WeatherLoading, WeatherProps } from "@/components/ui/weather";

const weatherSchema = z.object({
  city: z.string().describe("The city name to get weather for"),
});

async function weatherData(input: z.infer<typeof weatherSchema>) {
  try {
    const response = await fetch('http://localhost:3000/weather.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    const result = data.find((item: WeatherProps) => item.city.toLowerCase() === input.city.toLowerCase());
    if (result) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return [result];
    } else {
      return [];
    }
  } catch (error: any) {
    throw new Error('Failed to fetch weather data:', error.message);
  }
  /*
    try {
      const response = await fetch(
        `https://freetestapi.com/api/v1/weathers?search=${input.city}`,
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      throw new Error("There was an error fetching the weather data.");
    }
    */
}

export const weatherTool = tool(
  async (input, config: RunnableConfig) => {
    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <WeatherLoading />,
          type: "append",
        },
      },
      config,
    );

    const data = await weatherData(input);
    const weatherProps = data && data.length > 0 ? data[0] : undefined;

    await dispatchCustomEvent(
      CUSTOM_EVENT_NAME,
      {
        output: {
          value: <Weather {...weatherProps} />,
          type: "update",
        },
      },
      config,
    );

    return JSON.stringify(data, null);
  },
  {
    name: "WeatherTool",
    description: `Use this tool to get the **current weather conditions** for a specific city.
It fetches up-to-date weather data including temperature, humidity, wind, and general conditions.

 Use this tool when the user:
- Asks about the weather in a specific city
- Wants to know if it's currently sunny, raining, hot, or cold somewhere
- Mentions travel or outdoor plans that depend on weather
- Asks for temperature, humidity, or wind speed

Example user queries:
- "What’s the weather like in Paris?"
- "Is it raining in Tokyo right now?"
- "Tell me the current temperature in New York"
- "Check if it’s sunny in Los Angeles"

Input should be the name of the city only (e.g., "London", "San Francisco", "Mumbai").

The tool will return a snapshot of the most recent weather available for that city.`,
    schema: weatherSchema,
  },
);
