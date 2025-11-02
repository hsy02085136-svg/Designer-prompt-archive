import { CommunityPost, PostReply } from '../types';

export const mockCommunityPosts: CommunityPost[] = [
    {
        id: 'post-1',
        author: 'AI_Explorer',
        title: 'Midjourney로 실사 같은 인물 사진 만들기 팁 질문',
        content: '안녕하세요, Midjourney를 사용해서 실사 같은 인물 사진을 만들려고 하는데 생각처럼 잘 안되네요. 특히 피부 질감이나 눈동자 표현이 어려운데, 제가 사용 중인 프롬프트(아래 첨부)에서 어떤 부분을 개선하면 좋을까요? 고수님들의 조언 부탁드립니다!',
        attachedPromptId: '6', 
        createdAt: new Date('2024-05-22T10:00:00Z').toISOString(),
    },
    {
        id: 'post-2',
        author: 'Design_Guru',
        title: 'DALL-E 3로 만든 수채화풍 풍경 공유합니다',
        content: '최근에 DALL-E 3로 작업한 수채화풍 풍경 프롬프트 공유합니다. "serene watercolor painting" 같은 구문이 정말 잘 먹히는 것 같아요. 다들 이 프롬프트를 어떻게 더 발전시킬 수 있을지 아이디어 있으신가요?',
        attachedPromptId: '8',
        createdAt: new Date('2024-05-21T18:00:00Z').toISOString(),
    }
];

export const mockPostReplies: PostReply[] = [
    {
        id: 'reply-1',
        postId: 'post-1',
        author: 'Prompt_Master',
        text: '프롬프트 잘 봤습니다! "photorealistic" 말고 "hyperrealistic"을 써보시고, "--style raw" 파라미터를 추가해보세요. 그리고 렌즈 정보(예: 85mm f1.4)를 추가하면 깊이감이 더 살아날거예요.',
        createdAt: new Date('2024-05-22T11:30:00Z').toISOString(),
    },
    {
        id: 'reply-2',
        postId: 'post-1',
        author: 'AI_Explorer',
        text: '와, 정말 감사합니다! 바로 적용해봐야겠어요!',
        createdAt: new Date('2024-05-22T11:35:00Z').toISOString(),
    },
    {
        id: 'reply-3',
        postId: 'post-2',
        author: 'Artistic_AI',
        text: '정말 아름다운 결과물이네요! 여기에 "golden hour lighting"이나 "soft morning mist" 같은 시간/날씨 관련 키워드를 추가하면 분위기가 더 극적으로 변할 것 같아요.',
        createdAt: new Date('2024-05-21T20:00:00Z').toISOString(),
    }
];
