import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { XMarkIcon } from './Icons';

interface PromptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Omit<Prompt, 'id' | 'createdAt'>, id?: string) => void;
  initialData?: Prompt | null;
}

const PromptFormModal: React.FC<PromptFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [resultImageUrl, setResultImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [aiTool, setAiTool] = useState('');
  const [tags, setTags] = useState('');
  const [memo, setMemo] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPromptText(initialData.promptText);
      setResultImageUrl(initialData.resultImageUrl || '');
      setPreviewImage(initialData.resultImageUrl || null);
      setAiTool(initialData.aiTool || '');
      setTags(initialData.tags.join(', '));
      setMemo(initialData.memo || '');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);
  
  const resetForm = () => {
    setTitle('');
    setPromptText('');
    setResultImageUrl('');
    setPreviewImage(null);
    setAiTool('');
    setTags('');
    setMemo('');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setResultImageUrl(dataUrl);
        setPreviewImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !promptText) {
        alert("제목과 프롬프트 내용은 필수입니다.");
        return;
    }
    const promptData = {
      title,
      promptText,
      resultImageUrl,
      aiTool,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      memo,
    };
    onSave(promptData, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{isEditing ? '프롬프트 수정' : '새 프롬프트 추가'}</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition"><XMarkIcon /></button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="promptText" className="block text-sm font-medium text-gray-700">프롬프트 내용 <span className="text-red-500">*</span></label>
              <textarea id="promptText" value={promptText} onChange={e => setPromptText(e.target.value)} required rows={5} className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">결과 이미지</label>
               {previewImage && <img src={previewImage} alt="Preview" className="mt-2 rounded-lg max-h-48" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
            </div>
            <div>
              <label htmlFor="aiTool" className="block text-sm font-medium text-gray-700">AI 툴 (예: Midjourney, Gemini)</label>
              <input type="text" id="aiTool" value={aiTool} onChange={e => setAiTool(e.target.value)} className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">태그 (쉼표로 구분)</label>
              <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="memo" className="block text-sm font-medium text-gray-700">메모 / 설명</label>
              <textarea id="memo" value={memo} onChange={e => setMemo(e.target.value)} rows={3} className="mt-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-md w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition">취소</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition">프롬프트 저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptFormModal;