export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  feedback?: {
    liked?: boolean;
    disliked?: boolean;
  };
}

export interface Conversation {
  id: string;
  messages: Message[];
  rating?: number;
  feedback?: string;
  timestamp: number;
}

export interface RootState {
  conversations: {
    conversations: Conversation[];
    activeConversationId: string | null;
  };
  theme: {
    darkMode: boolean;
  };
}