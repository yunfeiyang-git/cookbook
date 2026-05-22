import { useNavigate, useLocation } from 'react-router-dom';
import { RecipeForm } from '@/components/RecipeForm';
import { useRecipeStore } from '@/store/recipeStore';
import { ArrowLeft, Plus, Scan } from 'lucide-react';

interface OcrRecipeData {
  name: string;
  ingredients: string;
  steps: string;
  notes: string;
  category: string;
  image: string;
}

export function CreateRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  
  const state = location.state as { fromOcr?: boolean; recipeData?: OcrRecipeData };
  const isFromOcr = state?.fromOcr === true;
  const initialData = state?.recipeData;

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
        <div className="flex items-center gap-2 mb-2">
          {isFromOcr ? (
            <Scan className="w-6 h-6 text-green-500" />
          ) : (
            <Plus className="w-6 h-6 text-primary" />
          )}
          <h1 className="text-xl font-bold text-gray-800">
            {isFromOcr ? '编辑OCR识别结果' : '创建菜谱'}
          </h1>
        </div>
        
        {isFromOcr && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ 这是从OCR识别结果导入的菜谱，请检查并修改后保存。
            </p>
          </div>
        )}
        
        <RecipeForm onSubmit={handleSubmit} initialData={initialData} />
      </div>
    </div>
  );
}
