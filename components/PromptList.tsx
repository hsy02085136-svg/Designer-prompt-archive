import React from 'react';
import { Prompt } from '../types';
import PromptCard from './PromptCard';

interface PromptListProps {
  groupedPrompts: Map<string, Prompt[]>;
  onSelectPrompt: (prompt: Prompt) => void;
  onToggleFavorite: (id: string) => void;
}

const PromptList: React.FC<PromptListProps> = ({ groupedPrompts, onSelectPrompt, onToggleFavorite }) => {
  if (groupedPrompts.size === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-semibold text-gray-500">프롬프트를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mt-2">검색어나 필터를 조정하거나 새 프롬프트를 추가해 보세요!</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {Array.from(groupedPrompts.entries()).map(([aiTool, promptsInGroup]) => (
        <div key={aiTool}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize border-b border-gray-200 pb-2 flex items-center gap-3">
            <span className="text-indigo-500">{aiTool}</span>
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{promptsInGroup.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promptsInGroup.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} onSelect={onSelectPrompt} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptList;