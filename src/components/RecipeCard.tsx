import { Clock, Users, ChefHat } from 'lucide-react';
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
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${category?.color || '#FF6B35'}20` }}
            >
              <ChefHat className="w-6 h-6" style={{ color: category?.color || '#FF6B35' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                {recipe.name}
              </h3>
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs text-white font-medium mt-1"
                style={{ backgroundColor: category?.color || '#FF6B35' }}
              >
                {recipe.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
          <p className="text-sm text-gray-600 line-clamp-2">
            {recipe.notes}
          </p>
        )}
      </div>
    </div>
  );
}