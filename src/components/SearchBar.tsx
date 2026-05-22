import { Search } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';

export function SearchBar() {
  const { searchRecipes, searchQuery } = useRecipeStore();

  return (
    <div className="relative max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="搜索菜谱、食材、做法..."
        value={searchQuery}
        onChange={(e) => searchRecipes(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
      />
    </div>
  );
}