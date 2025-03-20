import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Star } from 'lucide-react';
import { rateConversation } from '../store/conversationsSlice';

interface FeedbackModalProps {
  conversationId: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ conversationId, onClose }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    dispatch(rateConversation({
      conversationId,
      rating,
      feedback,
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Rate this conversation</h2>
        
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={`p-1 ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              <Star size={24} fill="currentColor" />
            </button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts about this conversation..."
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          rows={4}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};