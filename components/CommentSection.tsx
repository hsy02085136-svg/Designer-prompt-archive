
import React, { useState } from 'react';
import { Comment } from '../types';
import { PlusIcon } from './Icons';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h4 className="font-semibold text-gray-800 mb-3 text-lg">코멘트 ({comments.length})</h4>
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {comments.length > 0 ? (
          comments
          .slice()
          .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm text-gray-800">{comment.author}</p>
                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              <p className="text-gray-700 text-sm">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm py-4 text-center">아직 코멘트가 없습니다. 첫 코멘트를 남겨보세요!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="코멘트 추가..."
          className="flex-grow bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
