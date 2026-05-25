import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import type { Recipe } from '@/types';

interface InitialData {
  name: string;
  ingredients: string;
  steps: string;
  notes: string;
  category: string;
}

interface RecipeFormProps {
  recipe?: Recipe | null;
  initialData?: InitialData | null;
  onSubmit: (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function RecipeForm({ recipe, initialData, onSubmit }: RecipeFormProps) {
  const { categories, addCategory } = useRecipeStore();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#FF6B35');

  const parseStringToArray = (str: string): string[] => {
    if (!str) return [''];
    const lines = str.split('\n').map(line => line.trim()).filter(line => line);
    return lines.length > 0 ? lines : [''];
  };

  const [formData, setFormData] = useState(() => {
    if (recipe) {
      return {
        name: recipe.name,
        category: recipe.category,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        notes: recipe.notes,
      };
    }
    if (initialData) {
      return {
        name: initialData.name,
        category: initialData.category || categories[0]?.name || '',
        ingredients: parseStringToArray(initialData.ingredients),
        steps: parseStringToArray(initialData.steps),
        notes: initialData.notes,
      };
    }
    return {
      name: '',
      category: categories[0]?.name || '',
      ingredients: [''],
      steps: [''],
      notes: '',
    };
  });

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData({ ...formData, steps: newSteps });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = formData.ingredients.filter((i) => i.trim());
    const validSteps = formData.steps.filter((s) => s.trim());
    
    if (!formData.name.trim() || validIngredients.length === 0 || validSteps.length === 0) {
      alert('请填写菜谱名称、至少一种食材和一个步骤');
      return;
    }

    onSubmit({
      ...formData,
      ingredients: validIngredients,
      steps: validSteps,
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">菜谱名称</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="请输入菜谱名称"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
        <div className="flex gap-2">
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {showAddCategory && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="新分类名称"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              添加
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">食材</label>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={`食材 ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                disabled={formData.ingredients.length === 1}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors w-full"
          >
            <Plus className="w-5 h-5" />
            添加食材
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">做法步骤</label>
        <div className="space-y-2">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium shrink-0">
                {index + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={2}
                placeholder={`步骤 ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                disabled={formData.steps.length === 1}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors w-full"
          >
            <Plus className="w-5 h-5" />
            添加步骤
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={3}
          placeholder="烹饪小贴士、注意事项等..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {recipe ? '保存修改' : (initialData ? '保存菜谱' : '创建菜谱')}
        </button>
      </div>
    </form>
  );
}