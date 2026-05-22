import { Clock, Users } from 'lucide-react';
import type { Recipe } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useRecipeStore } from '@/store/recipeStore';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const { categories } = useRecipeStore();
  const category = categories.find((c) => c.name === recipe.category);

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs text-white font-medium"
          style={{ backgroundColor: category?.color || '#FF6B35' }}
        >
          {recipe.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.ingredients.length}种食材
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.steps.length}步
          </span>
        </div>
        {recipe.notes && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {recipe.notes}
          </p>
        )}
      </div>
    </div>
  );
}