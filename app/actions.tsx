import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateId } from 'ai';
import {
  createAI,
  createStreamableValue,
  getMutableAIState as $getMutableAIState,
  streamUI,
} from 'ai/rsc';
import { Message, BotMessage } from '../components/message';
import { z } from 'zod';
import { ChartCard } from '../components/chart-card' 
import { SkeletonChartCard } from '../components/chart-card-skeleton'
import WeatherCard from '../components/weather-card';

type AIProviderNoActions = ReturnType<typeof createAI<AIState, UIState>>;
// typed wrapper *without* actions defined to avoid circular dependencies
const getMutableAIState = $getMutableAIState<AIProviderNoActions>;

// mock function to fetch weather data
const fetchWeatherData = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { temperature: '72°F' };
};

const fetchSalesforceData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { month: "January", openCases: 42 },
    { month: "February", openCases: 38 },
    { month: "March", openCases: 45 },
    { month: "April", openCases: 39 },
    { month: "May", openCases: 36 },
    { month: "June", openCases: 41 },
  ];
};

export async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      { id: generateId(), role: 'user', content },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: React.ReactNode;

  const result = await streamUI({
    model: openai('gpt-4-turbo'),
    initial: <Message role="assistant">Working on that...</Message>,
    system: 'You are a weather assistant.',
    messages: aiState
      .get()
      .messages.map(({ role, content }) => ({ role, content } as CoreMessage)),

    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <BotMessage textStream={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.update({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            { id: generateId(), role: 'assistant', content },
          ],
        });
      } else {
        textStream.append(delta);
      }

      return textNode;
    },
    tools: {
      get_current_weather: {
        description: 'Get the current weather',
        parameters: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield (
            <Message role="assistant">Loading weather for {location}</Message>
          );
          const { temperature } = await fetchWeatherData(location);
          return (
            <Message role="assistant">
              <WeatherCard 
                location={location}
                temperature={parseInt(temperature)}
                time={new Date().toLocaleTimeString()}
                date={new Date().toLocaleDateString()}
              />
            </Message>
          );
        },
      },
      get_salesforce_data: {
        description: 'Get Salesforce open cases data',
        parameters: z.object({}),
        generate: async function* () {
          yield <SkeletonChartCard />;
          const salesforceData = await fetchSalesforceData();
          aiState.update(currentState => ({
            ...currentState,
            salesforceData, // Store the data in the AI state
          }));
          const trendPercentage = ((salesforceData[5].openCases - salesforceData[0].openCases) / salesforceData[0].openCases) * 100;
          
          return (
            <Message role="assistant">
              <ChartCard
                title="Open Cases"
                description="January - June 2024"
                trendPercentage={15}
                footerText="Showing total open cases for the last 6 months"
                chartData={salesforceData}
              />
            </Message>
          );
        },
      },
    },
    onFinish: event => {
      const { salesforceData } = aiState.get(); // Retrieve the data from AI state
      if (salesforceData) {
        const chartData = JSON.stringify(salesforceData);
        const systemMessage = `The user saw a chart with the following data: ${chartData}`;
        
        aiState.update(currentState => ({
          ...currentState,
          messages: [
            ...currentState.messages,
            { id: generateId(), role: 'system', content: systemMessage },
          ],
        }));

        console.log(`[onFinish]: ${JSON.stringify(event, null, 2)}`);
      }
    },
  });

  return {
    id: generateId(),
    display: result.value,
  };
}

export type ClientMessage = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: ClientMessage[];
  salesforceData?: { month: string; openCases: number }[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState: [] as UIState,
  initialAIState: { chatId: generateId(), messages: [] } as AIState,
});
