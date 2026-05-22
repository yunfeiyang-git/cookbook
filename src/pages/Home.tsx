import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipeStore } from '@/store/recipeStore';
import { ChefHat } from 'lucide-react';

export function Home() {
  const filteredRecipes = useRecipeStore((state) => state.filteredRecipes());

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      <div className="mb-6">
        <CategoryFilter />
      </div>
      {filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <ChefHat className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">暂无菜谱</p>
          <p className="text-sm">点击上方"创建菜谱"按钮添加第一个菜谱</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}