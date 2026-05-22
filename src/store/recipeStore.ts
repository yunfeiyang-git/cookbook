import { create } from 'zustand';
import type { Recipe, Category } from '@/types';
import { getRecipes, saveRecipes, getCategories, saveCategories } from '@/utils/storage';

interface RecipeStore {
  recipes: Recipe[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Omit<Recipe, 'id' | 'createdAt'>>) => void;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  searchRecipes: (query: string) => void;
  filterByCategory: (category: string) => void;
  addCategory: (name: string, color: string) => void;
  filteredRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: getRecipes(),
  categories: getCategories(),
  searchQuery: '',
  selectedCategory: '',

  addRecipe: (recipe) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedRecipes = [...get().recipes, newRecipe];
    set({ recipes: updatedRecipes });
    saveRecipes(updatedRecipes);
  },

  updateRecipe: (id, recipe) => {
    const updatedRecipes = get().recipes.map((r) =>
      r.id === id ? { ...r, ...recipe, updatedAt: new Date() } : r
    );
    set({ recipes: updatedRecipes });
    saveRecipes(updatedRecipes);
  },

  deleteRecipe: (id) => {
    const updatedRecipes = get().recipes.filter((r) => r.id !== id);
    set({ recipes: updatedRecipes });
    saveRecipes(updatedRecipes);
  },

  getRecipeById: (id) => {
    return get().recipes.find((r) => r.id === id);
  },

  searchRecipes: (query) => {
    set({ searchQuery: query });
  },

  filterByCategory: (category) => {
    set({ selectedCategory: category });
  },

  addCategory: (name, color) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    const updatedCategories = [...get().categories, newCategory];
    set({ categories: updatedCategories });
    saveCategories(updatedCategories);
  },

  filteredRecipes: () => {
    const { recipes, searchQuery, selectedCategory } = get();
    return recipes.filter((recipe) => {
      const matchesSearch =
        !searchQuery ||
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.steps.some((step) =>
          step.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        recipe.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || recipe.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  },
}));