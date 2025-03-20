import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Star, ArrowUpDown } from 'lucide-react';
import type { RootState, Conversation } from '../types';

type SortField = 'date' | 'rating';
type SortOrder = 'asc' | 'desc';

export const FeedbackOverview: React.FC = () => {
  const conversations = useSelector((state: RootState) => state.conversations.conversations);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const sortedAndFilteredConversations = useMemo(() => {
    let filtered = conversations.filter(c => c.rating !== undefined);
    
    if (ratingFilter !== null) {
      filtered = filtered.filter(c => c.rating === ratingFilter);
    }

    return filtered.sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'asc'
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp;
      } else {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortOrder === 'asc'
          ? ratingA - ratingB
          : ratingB - ratingA;
      }
    });
  }, [conversations, sortField, sortOrder, ratingFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Feedback Overview</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Filter by rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                className={`p-1 rounded ${
                  ratingFilter === rating
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Star size={16} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAndFilteredConversations.map((conversation: Conversation) => (
              <tr key={conversation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {new Date(conversation.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: conversation.rating || 0 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {conversation.feedback || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};