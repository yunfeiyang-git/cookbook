import type { Recipe, Category } from '@/types';

const RECIPES_KEY = 'recipe_manager_recipes';
const CATEGORIES_KEY = 'recipe_manager_categories';

const defaultCategories: Category[] = [
  { id: '1', name: '热菜', color: '#FF6B35' },
  { id: '2', name: '凉菜', color: '#1E88E5' },
  { id: '3', name: '西餐', color: '#43A047' },
  { id: '4', name: '汤羹', color: '#8E24AA' },
  { id: '5', name: '调料', color: '#FB8C00' },
  { id: '6', name: '面点', color: '#E53935' },
];

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    name: '番茄炒蛋',
    category: '热菜',
    ingredients: ['番茄2个', '鸡蛋3个', '盐适量', '糖少许'],
    steps: [
      '番茄洗净切块',
      '鸡蛋打散备用',
      '锅中放油，倒入鸡蛋液炒至凝固',
      '加入番茄块翻炒',
      '加入盐和糖调味，翻炒均匀即可',
    ],
    notes: '番茄选择熟透的会更甜',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: '麻婆豆腐',
    category: '热菜',
    ingredients: ['嫩豆腐1块', '牛肉末100g', '豆瓣酱1勺', '花椒粉适量'],
    steps: [
      '豆腐切小块，焯水备用',
      '锅中放油，炒香牛肉末',
      '加入豆瓣酱翻炒出红油',
      '加入豆腐轻轻翻炒',
      '加水炖煮几分钟，勾芡出锅',
      '撒上花椒粉即可',
    ],
    notes: '用嫩豆腐口感更好',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: '凉拌黄瓜',
    category: '凉菜',
    ingredients: ['黄瓜1根', '蒜末适量', '生抽1勺', '香醋1勺', '香油少许'],
    steps: [
      '黄瓜洗净拍碎切块',
      '加入蒜末、生抽、香醋',
      '滴入香油，搅拌均匀即可',
    ],
    notes: '冰镇后口感更好',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
];

export function getRecipes(): Recipe[] {
  try {
    const data = localStorage.getItem(RECIPES_KEY);
    if (data) {
      const recipes = JSON.parse(data);
      return recipes.map((r: Recipe) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }));
    }
  } catch (e) {
    console.error('Failed to get recipes:', e);
  }
  saveRecipes(defaultRecipes);
  return defaultRecipes;
}

export function saveRecipes(recipes: Recipe[]): void {
  try {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (e) {
    console.error('Failed to save recipes:', e);
  }
}

export function getCategories(): Category[] {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get categories:', e);
  }
  saveCategories(defaultCategories);
  return defaultCategories;
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
}

export function exportRecipesToTxt(recipes: Recipe[]): string {
  let txt = '菜谱大全\n';
  txt += '='.repeat(50) + '\n\n';
  
  recipes.forEach((recipe, index) => {
    txt += `${index + 1}. ${recipe.name}\n`;
    txt += `-`.repeat(30) + '\n';
    txt += `分类：${recipe.category}\n\n`;
    
    txt += `【食材】\n`;
    recipe.ingredients.forEach((ing, i) => {
      txt += `${i + 1}. ${ing}\n`;
    });
    txt += '\n';
    
    txt += `【做法】\n`;
    recipe.steps.forEach((step, i) => {
      txt += `${i + 1}. ${step}\n`;
    });
    txt += '\n';
    
    if (recipe.notes) {
      txt += `【备注】\n${recipe.notes}\n`;
    }
    
    txt += '\n' + '='.repeat(50) + '\n\n';
  });
  
  return txt;
}

export function downloadTxtFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}