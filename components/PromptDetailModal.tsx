
import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { XMarkIcon, ClipboardIcon, CheckIcon, PencilIcon, ShareIcon, StarIcon, ArrowUpTrayIcon } from './Icons';
import TagPill from './TagPill';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onEdit: (prompt: Prompt) => void;
  onToggleFavorite: (promptId: string) => void;
  onShareToCommunity: (prompt: Prompt) => void;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ 
    prompt, 
    onClose, 
    onEdit, 
    onToggleFavorite,
    onShareToCommunity
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (!prompt) {
      setIsCopied(false);
      setIsShared(false);
    }
  }, [prompt]);

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const handleShare = () => {
    if (!prompt) return;

    const shareText = `
제목: ${prompt.title}
${prompt.aiTool ? `AI 툴: ${prompt.aiTool}` : ''}
태그: ${prompt.tags.map(t => `#${t}`).join(', ')}

--- 프롬프트 ---
${prompt.promptText}

${prompt.memo ? `---\n메모: ${prompt.memo}` : ''}

AI Prompt Archive에서 공유됨
    `.trim().replace(/^\s+/gm, '');

    navigator.clipboard.writeText(shareText);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
            <XMarkIcon />
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 flex-shrink-0">
                <img src={prompt.resultImageUrl || `https://picsum.photos/seed/${prompt.id}/800/450`} alt={prompt.title} className="rounded-lg w-full object-cover"/>
            </div>

            <div className="md:w-1/2 flex flex-col">
                <div className="flex items-start justify-between">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 break-words max-w-[90%]">{prompt.title}</h2>
                    <button 
                        onClick={handleFavoriteClick}
                        className="p-2 text-gray-500 hover:text-yellow-500 transition-colors flex-shrink-0"
                        aria-label="즐겨찾기"
                    >
                        <StarIcon className={`w-7 h-7 ${prompt.isFavorite ? 'text-yellow-400' : ''}`} solid={!!prompt.isFavorite} />
                    </button>
                </div>
                {prompt.aiTool && <p className="text-indigo-500 font-semibold mb-4">{prompt.aiTool}</p>}
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map(tag => <TagPill key={tag} tag={tag} />)}
                  </div>
                </div>

                {prompt.memo && (
                    <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">메모</h4>
                    <p className="text-gray-600 bg-gray-100 p-3 rounded-md text-sm">{prompt.memo}</p>
                    </div>
                )}
                <div className="flex-grow"></div>
                
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <button onClick={() => onShareToCommunity(prompt)} className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <ArrowUpTrayIcon /> 커뮤니티에 질문하기
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                        {isShared ? <CheckIcon className="w-5 h-5 text-green-500"/> : <ShareIcon className="w-5 h-5"/> }
                        {isShared ? '복사됨' : '공유'}
                    </button>
                    <button onClick={() => onEdit(prompt)} className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PencilIcon /> 수정
                    </button>
                </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">프롬프트</h4>
            <div className="relative bg-gray-100 p-4 rounded-lg">
              <pre className="text-gray-800 whitespace-pre-wrap break-words font-sans text-sm">{prompt.promptText}</pre>
              <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 bg-gray-300 rounded-md hover:bg-gray-400 transition">
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailModal;
