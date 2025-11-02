
import React, { useRef } from 'react';
import { PlusIcon, SearchIcon, StarIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from './Icons';
import TagPill from './TagPill';

interface HeaderProps {
  onSearch: (term: string) => void;
  onAddNew: () => void;
  categorizedTags: Map<string, string[]>;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  currentView: 'archive' | 'community';
}

const Header: React.FC<HeaderProps> = ({ 
    onSearch, 
    onAddNew, 
    categorizedTags, 
    activeTags, 
    onTagClick,
    sortOption,
    onSortChange,
    showFavoritesOnly,
    onToggleFavoritesFilter,
    onImport,
    onExport,
    currentView,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <header className="p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            AI Prompt <span className="text-indigo-500">Archive</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="제목, 태그, 메모로 검색..."
                className="bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 transition"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            {currentView === 'archive' && (
              <button
                onClick={onAddNew}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">새 프롬프트</span>
              </button>
            )}
          </div>
        </div>
        
        {currentView === 'archive' && (
          <>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor="sort-select" className="text-sm font-medium text-gray-600">정렬:</label>
                    <select 
                        id="sort-select"
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                    >
                        <option value="createdAt-desc">최신순</option>
                        <option value="createdAt-asc">오래된순</option>
                        <option value="title-asc">제목 (오름차순)</option>
                        <option value="title-desc">제목 (내림차순)</option>
                        <option value="aiTool-asc">AI 툴 (오름차순)</option>
                        <option value="aiTool-desc">AI 툴 (내림차순)</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onToggleFavoritesFilter}
                        className={`p-2 rounded-lg transition-colors duration-200 ${showFavoritesOnly ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        aria-label="즐겨찾기만 보기"
                    >
                        <StarIcon className="w-5 h-5" solid={showFavoritesOnly} />
                    </button>
                    
                    <input type="file" ref={fileInputRef} onChange={onImport} accept=".json" style={{ display: 'none' }} />
                    <button
                        onClick={handleImportClick}
                        className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-colors"
                    >
                        <ArrowDownTrayIcon /> <span className="hidden md:inline">가져오기</span>
                    </button>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-colors"
                    >
                        <ArrowUpTrayIcon /> <span className="hidden md:inline">내보내기</span>
                    </button>
                </div>
            </div>

            {categorizedTags.size > 0 && (
              <div className="mt-6 space-y-3">
                {Array.from(categorizedTags.entries()).map(([category, tags]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      {tags.map(tag => (
                        <TagPill
                          key={tag}
                          tag={tag}
                          onClick={onTagClick}
                          isActive={activeTags.includes(tag)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
