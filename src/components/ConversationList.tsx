import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, Star } from 'lucide-react';
import { setActiveConversation } from '../store/conversationsSlice';
import type { RootState, Conversation } from '../types';

export const ConversationList: React.FC = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state: RootState) => state.conversations.conversations);
  const activeConversationId = useSelector((state: RootState) => state.conversations.activeConversationId);

  return (
    <div className="w-64 border-r h-full overflow-y-auto">
      {conversations.map((conversation: Conversation) => (
        <button
          key={conversation.id}
          onClick={() => dispatch(setActiveConversation(conversation.id))}
          className={`w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${
            activeConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <MessageCircle size={20} />
          <div className="flex-1 truncate">
            <div className="text-sm font-medium">
              Conversation {new Date(conversation.timestamp).toLocaleDateString()}
            </div>
            {conversation.rating && (
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: conversation.rating }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};