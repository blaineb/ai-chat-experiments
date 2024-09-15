'use client';

import { Fragment, useState } from 'react';
import type { AI } from './actions';
import { useActions } from 'ai/rsc';
import { useAIState, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { Message, UserMessage } from '../components/message';
import Composer from '@/components/composer';

// This component represents the main chat interface
export default function Home() {
  // State for the current input in the chat composer
  const [input, setInput] = useState('');
  
  // useUIState is a hook from ai/rsc for managing UI state
  // It's used here to manage the messages in the chat
  const [messages, setMessages] = useUIState<typeof AI>();
  
  // useActions is a hook from ai/rsc for accessing server actions
  // submitUserMessage is likely defined in ./actions.ts
  const { submitUserMessage } = useActions<typeof AI>();

  // Function to handle message submission
  const handleSubmission = async () => {
    if (!input.trim()) return;

    // Add the user's message to the UI state
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: generateId(), // generateId is a utility from the ai package
        display: <UserMessage role="user">{input}</UserMessage>,
      },
    ]);

    // Submit the user's message to the AI and get the response
    const response = await submitUserMessage(input);
    
    // Add the AI's response to the UI state
    setMessages(currentMessages => [...currentMessages, response]);
    
    // Clear the input field
    setInput('');
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="flex flex-col pb-32 pt-8" style={{ width: '568px' }}>
        {/* Commented out components, likely for future use
        <ResultsCarousel />
        <ChartCard /> */}
        
        {/* Display all messages */}
        <div id="messages-wrap">
          {messages.map(message => (
            <Fragment key={message.id}>{message.display}</Fragment>
          ))}
        </div>
      </div>
      
      {/* Chat composer component */}
      <div id="composer-wrap" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[580px]">
        <Composer
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmission}
        />
      </div>
    </div>
  );
}