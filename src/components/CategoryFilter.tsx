import { useRecipeStore } from '@/store/recipeStore';
import { Tag } from 'lucide-react';

export function CategoryFilter() {
  const { categories, selectedCategory, filterByCategory } = useRecipeStore();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => filterByCategory('')}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
          selectedCategory === ''
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Tag className="w-3.5 h-3.5" />
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => filterByCategory(category.name)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${
            selectedCategory === category.name
              ? 'text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={{
            backgroundColor: selectedCategory === category.name ? category.color : undefined,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
          {category.name}
        </button>
      ))}
    </div>
  );
}