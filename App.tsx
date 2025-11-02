
import React, { useState, useMemo } from 'react';
import { Prompt, CommunityPost, PostReply } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockPrompts } from './data/mockPrompts';
import { mockCommunityPosts, mockPostReplies } from './data/mockCommunity';
import Header from './components/Header';
import Banner from './components/Banner';
import PromptList from './components/PromptList';
import PromptDetailModal from './components/PromptDetailModal';
import PromptFormModal from './components/PromptFormModal';
import ViewSwitcher from './components/ViewSwitcher';
import CommunityView from './components/CommunityView';

const TAG_CATEGORIES: { [key: string]: string[] } = {
  '주제': ['도시', '캐릭터', '풍경', '로고', '제품', '음식', '인테리어', '디자인', '사진', '컨셉아트'],
  '스타일': ['실사풍', '3D', '판타지', '수채화', '미니멀리즘', '사이버펑크', '픽사스타일', '스튜디오지브리'],
};

const tagToCategoryMap = new Map<string, string>();
Object.entries(TAG_CATEGORIES).forEach(([category, tags]) => {
  tags.forEach(tag => tagToCategoryMap.set(tag, category));
});

const categorizeTags = (tags: string[]): Map<string, string[]> => {
  const categorized = new Map<string, string[]>();
  
  const categoryOrder = [...Object.keys(TAG_CATEGORIES), '기타'];
  categoryOrder.forEach(category => {
    categorized.set(category, []);
  });

  tags.forEach(tag => {
    const category = tagToCategoryMap.get(tag) || '기타';
    if(categorized.has(category)) {
      categorized.get(category)!.push(tag);
    }
  });

  for (const [category, tagList] of categorized.entries()) {
    if (tagList.length === 0) {
      categorized.delete(category);
    }
  }

  return categorized;
};

const App: React.FC = () => {
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>('prompts', mockPrompts);
  const [communityPosts, setCommunityPosts] = useLocalStorage<CommunityPost[]>('communityPosts', mockCommunityPosts);
  const [postReplies, setPostReplies] = useLocalStorage<PostReply[]>('postReplies', mockPostReplies);
  
  const [currentView, setCurrentView] = useState<'archive' | 'community'>('archive');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);

  const [sortOption, setSortOption] = useState('createdAt-desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [promptToAttach, setPromptToAttach] = useState<Prompt | null>(null);


  const categorizedTags = useMemo(() => {
    const allUniqueTags = Array.from(new Set(prompts.flatMap(p => p.tags))).sort();
    const filterableTags = new Set(Object.values(TAG_CATEGORIES).flat());
    const tagsToShow = allUniqueTags.filter(tag => filterableTags.has(tag));
    return categorizeTags(tagsToShow);
  }, [prompts]);
  
  const filterAndSortArchivePrompts = () => {
    let filteredPrompts = [...prompts];

    if (showFavoritesOnly) {
      filteredPrompts = filteredPrompts.filter(p => p.isFavorite);
    }
    if (activeTags.length > 0) {
      filteredPrompts = filteredPrompts.filter(p => activeTags.every(tag => p.tags.includes(tag)));
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    if (searchLower) {
      filteredPrompts = filteredPrompts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        (p.memo && p.memo.toLowerCase().includes(searchLower)) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    const [sortBy, sortOrder] = sortOption.split('-');
    filteredPrompts.sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (sortBy) {
            case 'title':
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
                break;
            case 'aiTool':
                valA = a.aiTool?.toLowerCase() || '';
                valB = b.aiTool?.toLowerCase() || '';
                break;
            case 'createdAt':
            default:
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
                break;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const map = new Map<string, Prompt[]>();
    filteredPrompts.forEach(prompt => {
        const tool = prompt.aiTool || '미지정';
        if (!map.has(tool)) {
            map.set(tool, []);
        }
        map.get(tool)!.push(prompt);
    });
    
    const sortedEntries = [...map.entries()].sort((a, b) => {
        if (a[0] === '미지정') return 1;
        if (b[0] === '미지정') return -1;
        return a[0].localeCompare(b[0]);
    });

    return new Map(sortedEntries);
  }

  const groupedArchivePrompts = useMemo(filterAndSortArchivePrompts, [prompts, searchTerm, activeTags, sortOption, showFavoritesOnly]);
  
  const filteredCommunityPosts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return communityPosts;
    return communityPosts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.content.toLowerCase().includes(searchLower)
    );
  }, [communityPosts, searchTerm]);


  const handleTagClick = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleOpenForm = (promptToEdit?: Prompt) => {
    setEditingPrompt(promptToEdit || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPrompt(null);
  };
  
  const handleToggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));    
    if (viewingPrompt && viewingPrompt.id === id) {
      setViewingPrompt(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };
  
  const handleExport = () => {
    if (prompts.length === 0) {
      alert("내보낼 프롬프트가 없습니다.");
      return;
    }
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    link.download = `prompt-archive_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("파일을 읽을 수 없습니다.");
        const importedPrompts = JSON.parse(text);
        
        if (!Array.isArray(importedPrompts) || !importedPrompts.every(p => p.id && p.title && p.promptText)) {
          throw new Error("올바르지 않은 파일 형식입니다.");
        }
        
        if (window.confirm("가져온 데이터로 현재 프롬프트 목록을 덮어쓰시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
          setPrompts(importedPrompts);
        }
      } catch (error) {
        alert(`가져오기 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSavePrompt = (promptData: Omit<Prompt, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...promptData } : p));
    } else {
      const newPrompt: Prompt = {
        ...promptData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };
      setPrompts(prev => [newPrompt, ...prev]);
    }
  };

  const handleShareToCommunity = (prompt: Prompt) => {
    setViewingPrompt(null);
    setPromptToAttach(prompt);
    setIsPostFormOpen(true);
    setCurrentView('community');
  };

  const handleSavePost = (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'author'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: crypto.randomUUID(),
      author: '나',
      createdAt: new Date().toISOString(),
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    setIsPostFormOpen(false);
    setPromptToAttach(null);
  };

  const handleAddReply = (postId: string, text: string) => {
    const newReply: PostReply = {
        id: crypto.randomUUID(),
        postId,
        author: '나',
        text,
        createdAt: new Date().toISOString(),
    };
    setPostReplies(prev => [...prev, newReply]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchTerm}
        onAddNew={() => handleOpenForm()}
        categorizedTags={categorizedTags}
        activeTags={activeTags}
        onTagClick={handleTagClick}
        sortOption={sortOption}
        onSortChange={setSortOption}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesFilter={() => setShowFavoritesOnly(prev => !prev)}
        onImport={handleImport}
        onExport={handleExport}
        currentView={currentView}
      />
      
      <Banner />
      
      <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto">
        {currentView === 'archive' ? (
          <PromptList 
            groupedPrompts={groupedArchivePrompts}
            onSelectPrompt={(prompt) => setViewingPrompt(prompt)} 
            onToggleFavorite={handleToggleFavorite} 
          />
        ) : (
          <CommunityView
            posts={filteredCommunityPosts}
            replies={postReplies}
            prompts={prompts}
            onAddPost={() => { setPromptToAttach(null); setIsPostFormOpen(true); }}
            onSavePost={handleSavePost}
            onAddReply={handleAddReply}
            isPostFormOpen={isPostFormOpen}
            onClosePostForm={() => setIsPostFormOpen(false)}
            promptToAttach={promptToAttach}
          />
        )}
      </main>

      <PromptFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSavePrompt}
        initialData={editingPrompt}
      />

      {viewingPrompt && (
        <PromptDetailModal
          prompt={viewingPrompt}
          onClose={() => setViewingPrompt(null)}
          onEdit={(prompt) => {
            setViewingPrompt(null);
            handleOpenForm(prompt);
          }}
          onToggleFavorite={handleToggleFavorite}
          onShareToCommunity={handleShareToCommunity}
        />
      )}
    </div>
  );
};

export default App;
