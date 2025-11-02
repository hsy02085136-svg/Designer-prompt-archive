
import React from 'react';
import { Prompt } from '../types';
import TagPill from './TagPill';
import { StarIcon } from './Icons';

interface PromptCardProps {
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
  onToggleFavorite: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect, onToggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  return (
    <div
      onClick={() => onSelect(prompt)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 relative"
    >
      <button 
        onClick={handleFavoriteClick} 
        className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition-colors z-10"
        aria-label="즐겨찾기"
      >
        <StarIcon className={`w-5 h-5 ${prompt.isFavorite ? 'text-yellow-400' : 'text-white'}`} solid={!!prompt.isFavorite} />
      </button>

      <img
        src={prompt.resultImageUrl || `https://picsum.photos/seed/${prompt.id}/400/225`}
        alt={prompt.title}
        className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 truncate">{prompt.title}</h3>
        {prompt.aiTool && <p className="text-sm text-gray-500 mb-2">{prompt.aiTool}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {prompt.tags.slice(0, 3).map(tag => (
            <TagPill key={tag} tag={tag} />
          ))}
          {prompt.tags.length > 3 && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">+{prompt.tags.length - 3}</span>}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;