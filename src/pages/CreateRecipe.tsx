import { useNavigate } from 'react-router-dom';
import { RecipeForm } from '@/components/RecipeForm';
import { useRecipeStore } from '@/store/recipeStore';
import { ArrowLeft, Plus } from 'lucide-react';

export function CreateRecipe() {
  const navigate = useNavigate();
  const addRecipe = useRecipeStore((state) => state.addRecipe);

  const handleSubmit = (data: {
    name: string;
    category: string;
    ingredients: string[];
    steps: string[];
    notes: string;
    image: string;
  }) => {
    addRecipe(data);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-gray-800">创建菜谱</h1>
        </div>
        <RecipeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}