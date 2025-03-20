import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message } from '../types';

interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  activeConversationId: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    createConversation: (state) => {
      const newConversation: Conversation = {
        id: uuidv4(),
        messages: [],
        timestamp: Date.now(),
      };
      state.conversations.push(newConversation);
      state.activeConversationId = newConversation.id;
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; content: string; sender: 'user' | 'ai' }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        const newMessage: Message = {
          id: uuidv4(),
          content: action.payload.content,
          sender: action.payload.sender,
          timestamp: Date.now(),
        };
        conversation.messages.push(newMessage);
      }
    },
    updateFeedback: (state, action: PayloadAction<{ 
      conversationId: string;
      messageId: string;
      feedback: { liked?: boolean; disliked?: boolean };
    }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        const message = conversation.messages.find(m => m.id === action.payload.messageId);
        if (message) {
          message.feedback = {
            ...message.feedback,
            ...action.payload.feedback,
          };
        }
      }
    },
    rateConversation: (state, action: PayloadAction<{ 
      conversationId: string;
      rating: number;
      feedback?: string;
    }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.rating = action.payload.rating;
        if (action.payload.feedback) {
          conversation.feedback = action.payload.feedback;
        }
      }
    },
  },
});

export const {
  createConversation,
  setActiveConversation,
  addMessage,
  updateFeedback,
  rateConversation,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;