
const tagColors = [
  { bg: 'bg-red-100', text: 'text-red-800', activeBg: 'bg-red-500', hover: 'hover:bg-red-200' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', activeBg: 'bg-yellow-500', hover: 'hover:bg-yellow-200' },
  { bg: 'bg-green-100', text: 'text-green-800', activeBg: 'bg-green-500', hover: 'hover:bg-green-200' },
  { bg: 'bg-blue-100', text: 'text-blue-800', activeBg: 'bg-blue-500', hover: 'hover:bg-blue-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', activeBg: 'bg-indigo-500', hover: 'hover:bg-indigo-200' },
  { bg: 'bg-purple-100', text: 'text-purple-800', activeBg: 'bg-purple-500', hover: 'hover:bg-purple-200' },
  { bg: 'bg-pink-100', text: 'text-pink-800', activeBg: 'bg-pink-500', hover: 'hover:bg-pink-200' },
  { bg: 'bg-teal-100', text: 'text-teal-800', activeBg: 'bg-teal-500', hover: 'hover:bg-teal-200' },
  { bg: 'bg-orange-100', text: 'text-orange-800', activeBg: 'bg-orange-500', hover: 'hover:bg-orange-200' },
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export const getTagColor = (tag: string) => {
  const hash = simpleHash(tag);
  const index = hash % tagColors.length;
  return tagColors[index];
};
