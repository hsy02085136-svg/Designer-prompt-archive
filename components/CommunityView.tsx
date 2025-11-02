import React, { useState, useEffect } from 'react';
import { CommunityPost, PostReply, Prompt } from '../types';
import { PlusIcon, XMarkIcon } from './Icons';
import TagPill from './TagPill';

// --- 작은 컴포넌트들 ---

const AttachedPrompt: React.FC<{ prompt: Prompt }> = ({ prompt }) => (
    <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-4">
        <img src={prompt.resultImageUrl || `https://picsum.photos/seed/${prompt.id}/150/100`} alt={prompt.title} className="w-24 h-16 object-cover rounded-md flex-shrink-0" />
        <div className="overflow-hidden">
            <p className="text-xs text-indigo-500 font-semibold">첨부된 프롬프트</p>
            <h5 className="font-bold text-gray-800 truncate">{prompt.title}</h5>
            <p className="text-xs text-gray-500 truncate">{prompt.promptText}</p>
        </div>
    </div>
);


const CommunityPostCard: React.FC<{ post: CommunityPost; replyCount: number; onSelect: () => void; }> = ({ post, replyCount, onSelect }) => (
    <div onClick={onSelect} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full">{replyCount} 답변</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
            <span>by {post.author}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
    </div>
);

// --- 모달 컴포넌트들 ---

const CommunityPostDetailModal: React.FC<{
    post: CommunityPost;
    replies: PostReply[];
    attachedPrompt: Prompt | null;
    onClose: () => void;
    onAddReply: (text: string) => void;
}> = ({ post, replies, attachedPrompt, onClose, onAddReply }) => {
    const [newReply, setNewReply] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReply.trim()) {
            onAddReply(newReply.trim());
            setNewReply('');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 relative">
                    <h2 className="text-3xl font-bold text-gray-900">{post.title}</h2>
                    <p className="text-sm text-gray-500 mt-2">작성자: {post.author} · {new Date(post.createdAt).toLocaleString()}</p>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"><XMarkIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    {attachedPrompt && <AttachedPrompt prompt={attachedPrompt} />}

                    <div className="mt-8">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">답변 ({replies.length})</h4>
                        <div className="space-y-4">
                            {replies.length > 0 ? (
                                replies
                                .slice()
                                .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                .map((reply) => (
                                    <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-sm text-gray-800">{reply.author}</p>
                                            <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-gray-700 text-sm">{reply.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm py-4 text-center">아직 답변이 없습니다. 첫 답변을 남겨보세요!</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} placeholder="답변 추가..." className="flex-grow bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        <button type="submit" className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">답변하기</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const CommunityPostFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'author'>) => void;
    promptToAttach: Prompt | null;
}> = ({ isOpen, onClose, onSave, promptToAttach }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setContent('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용은 필수입니다.");
            return;
        }
        onSave({
            title,
            content,
            attachedPromptId: promptToAttach?.id || null
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">새 질문/주제 추가</h2>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition"><XMarkIcon /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">제목</label>
                            <input type="text" id="post-title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">내용</label>
                            <textarea id="post-content" value={content} onChange={e => setContent(e.target.value)} required rows={8} className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="프롬프트에 대한 질문이나 공유하고 싶은 노하우를 자유롭게 작성해주세요."></textarea>
                        </div>
                        {promptToAttach && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">첨부된 프롬프트</h4>
                                <AttachedPrompt prompt={promptToAttach} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition">취소</button>
                    <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition">게시하기</button>
                </div>
            </form>
        </div>
    );
};

// --- 메인 뷰 컴포넌트 ---

interface CommunityViewProps {
    posts: CommunityPost[];
    replies: PostReply[];
    prompts: Prompt[];
    onAddPost: () => void;
    onSavePost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'author'>) => void;
    onAddReply: (postId: string, text: string) => void;
    isPostFormOpen: boolean;
    onClosePostForm: () => void;
    promptToAttach: Prompt | null;
}

const CommunityView: React.FC<CommunityViewProps> = ({
    posts,
    replies,
    prompts,
    onAddPost,
    onSavePost,
    onAddReply,
    isPostFormOpen,
    onClosePostForm,
    promptToAttach,
}) => {
    const [viewingPost, setViewingPost] = useState<CommunityPost | null>(null);

    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">커뮤니티 Q&A</h2>
                <button
                    onClick={onAddPost}
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>새 질문하기</span>
                </button>
            </div>

            {sortedPosts.length > 0 ? (
                <div className="space-y-6">
                    {sortedPosts.map(post => (
                        <CommunityPostCard
                            key={post.id}
                            post={post}
                            replyCount={replies.filter(r => r.postId === post.id).length}
                            onSelect={() => setViewingPost(post)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4">
                    <h2 className="text-2xl font-semibold text-gray-500">아직 게시글이 없습니다</h2>
                    <p className="text-gray-600 mt-2">첫 질문을 등록하여 커뮤니티를 시작해보세요!</p>
                </div>
            )}
            
            <CommunityPostFormModal
                isOpen={isPostFormOpen}
                onClose={onClosePostForm}
                onSave={onSavePost}
                promptToAttach={promptToAttach}
            />
            
            {viewingPost && (
                <CommunityPostDetailModal
                    post={viewingPost}
                    replies={replies.filter(r => r.postId === viewingPost.id)}
                    attachedPrompt={prompts.find(p => p.id === viewingPost.attachedPromptId) || null}
                    onClose={() => setViewingPost(null)}
                    onAddReply={(text) => onAddReply(viewingPost.id, text)}
                />
            )}
        </div>
    );
};

export default CommunityView;
