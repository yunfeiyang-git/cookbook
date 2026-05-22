import { useParams, useNavigate } from 'react-router-dom';
import { RecipeForm } from '@/components/RecipeForm';
import { useRecipeStore } from '@/store/recipeStore';
import { ArrowLeft, Edit3 } from 'lucide-react';

export function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = useRecipeStore((state) => state.getRecipeById(id || ''));
  const updateRecipe = useRecipeStore((state) => state.updateRecipe);

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
        <div className="text-center py-20 text-gray-500">
          <p>菜谱不存在</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: {
    name: string;
    category: string;
    ingredients: string[];
    steps: string[];
    notes: string;
    image: string;
  }) => {
    updateRecipe(recipe.id, data);
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(`/recipe/${recipe.id}`)}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Edit3 className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-gray-800">编辑菜谱</h1>
        </div>
        <RecipeForm recipe={recipe} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}