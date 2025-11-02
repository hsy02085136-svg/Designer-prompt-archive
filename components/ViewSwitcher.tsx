import React from 'react';
import { FolderIcon, ChatBubbleLeftRightIcon } from './Icons';

type View = 'archive' | 'community';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const baseCardClasses = "p-6 rounded-lg border cursor-pointer transition-all duration-300 text-left w-full";
  const inactiveCardClasses = "bg-white border-gray-200 hover:shadow-lg hover:border-indigo-400 hover:-translate-y-1";
  const activeCardClasses = "bg-indigo-50 border-indigo-500 ring-2 ring-offset-2 ring-indigo-500 shadow-md";
  
  return (
    <div className="bg-white py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => onViewChange('archive')}
                    className={`${baseCardClasses} ${currentView === 'archive' ? activeCardClasses : inactiveCardClasses}`}
                    aria-label="내 아카이브: 내 개인 작업물을 태그별로 저장하고 관리할 수 있습니다."
                >
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                           <FolderIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">내 아카이브</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                내 개인 작업물을 태그별로 저장하고 관리할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => onViewChange('community')}
                    className={`${baseCardClasses} ${currentView === 'community' ? activeCardClasses : inactiveCardClasses}`}
                    aria-label="커뮤니티: 프롬프트에 대해 질문하고, 다른 디자이너들과 아이디어를 공유할 수 있습니다."
                >
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                           <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                        </div>
                        <div>
                             <h3 className="text-lg sm:text-xl font-semibold text-gray-900">커뮤니티</h3>
                             <p className="mt-1 text-sm text-gray-600">
                                프롬프트에 대해 질문하고, 다른 디자이너들과 아이디어를 공유할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </button>
            </div>
      </div>
    </div>
  );
};

export default ViewSwitcher;