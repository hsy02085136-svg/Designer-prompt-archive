export interface Prompt {
  id: string;
  title: string;
  promptText: string;
  resultImageUrl?: string;
  aiTool?: string;
  tags: string[];
  memo?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface PostReply {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  attachedPromptId: string | null;
  createdAt: string;
}

// Fix: Add missing Comment interface to resolve import error in CommentSection.tsx.
export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}
