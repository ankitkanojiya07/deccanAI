import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MessageCircle, BarChart2, Sun, Moon, Plus } from 'lucide-react';
import { store } from './store';
import { ChatInterface } from './components/ChatInterface';
import { ConversationList } from './components/ConversationList';
import { FeedbackOverview } from './components/FeedbackOverview';
import { useDispatch, useSelector } from 'react-redux';
import { createConversation } from './store/conversationsSlice';
import { toggleDarkMode } from './store/themeSlice';
import type { RootState } from './types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <nav className="bg-white dark:bg-gray-800 border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-blue-500">AI Chat</Link>
          <Link to="/" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <MessageCircle size={20} />
            <span>Chat</span>
          </Link>
          <Link to="/feedback" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <BarChart2 size={20} />
            <span>Feedback</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  
  return (
    <>
      <ConversationList />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={() => dispatch(createConversation())}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            <span>New Conversation</span>
          </button>
        </div>
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/feedback" element={<FeedbackOverview />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;