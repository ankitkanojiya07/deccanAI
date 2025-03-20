import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { addMessage, updateFeedback } from '../store/conversationsSlice';
import type { RootState, Message } from '../types';

const mockAIResponse = async (message: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 60% chance of failure
  if (Math.random() < 0.6) {
    throw new Error('AI response failed');
  }

  const responses = [
    "I understand your perspective. Let me help you with that.",
    "That's an interesting point. Here's what I think...",
    "Based on what you've said, I would suggest...",
    "Let me analyze that for you...",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const ChatInterface: React.FC = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const activeConversationId = useSelector((state: RootState) => state.conversations.activeConversationId);
  const messages = useSelector((state: RootState) => {
    const conversation = state.conversations.conversations.find(c => c.id === activeConversationId);
    return conversation?.messages || [];
  });

  const handleSend = async () => {
    if (!input.trim() || !activeConversationId) return;

    // Send user message
    dispatch(addMessage({
      conversationId: activeConversationId,
      content: input,
      sender: 'user',
    }));

    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await mockAIResponse(input);
      dispatch(addMessage({
        conversationId: activeConversationId,
        content: response,
        sender: 'ai',
      }));
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: { liked?: boolean; disliked?: boolean }) => {
    if (!activeConversationId) return;
    dispatch(updateFeedback({
      conversationId: activeConversationId,
      messageId,
      feedback,
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative group max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {message.content}
              
              {message.sender === 'ai' && (
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 hidden group-hover:flex space-x-2">
                  <button
                    onClick={() => handleFeedback(message.id, { liked: true, disliked: false })}
                    className={`p-1 rounded ${message.feedback?.liked ? 'text-green-500' : 'text-gray-500'}`}
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, { liked: false, disliked: true })}
                    className={`p-1 rounded ${message.feedback?.disliked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg flex items-center space-x-2">
              <span>{error}</span>
              <button
                onClick={() => handleSend()}
                className="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};