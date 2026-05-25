import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeStore } from '@/store/recipeStore';
import { ArrowLeft, Edit3, Trash2, Clock, Users, Calendar, ChefHat } from 'lucide-react';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = useRecipeStore((state) => state.getRecipeById(id || ''));
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);
  const { categories } = useRecipeStore();

  if (!recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
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

  const category = categories.find((c) => c.name === recipe.category);

  const handleDelete = () => {
    if (confirm('确定要删除这个菜谱吗？')) {
      deleteRecipe(recipe.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
        <button
          onClick={() => navigate(`/edit/${recipe.id}`)}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          编辑
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          删除
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${category?.color || '#FF6B35'}20` }}
            >
              <ChefHat className="w-8 h-8" style={{ color: category?.color || '#FF6B35' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{recipe.name}</h1>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm text-white font-medium mt-1"
                style={{ backgroundColor: category?.color || '#FF6B35' }}
              >
                {recipe.category}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.ingredients.length}种食材
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.steps.length}步
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              创建于 {recipe.createdAt.toLocaleDateString('zh-CN')}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">食材</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-gray-600">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">做法步骤</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-600 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {recipe.notes && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">备注</h2>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}