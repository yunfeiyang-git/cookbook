import type { Recipe, Category } from '@/types';

const RECIPES_KEY = 'recipe_manager_recipes';
const CATEGORIES_KEY = 'recipe_manager_categories';

const defaultCategories: Category[] = [
  { id: '1', name: '家常菜', color: '#FF6B35' },
  { id: '2', name: '川菜', color: '#E53935' },
  { id: '3', name: '粤菜', color: '#1E88E5' },
  { id: '4', name: '西餐', color: '#43A047' },
  { id: '5', name: '甜点', color: '#FB8C00' },
  { id: '6', name: '汤羹', color: '#8E24AA' },
];

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    name: '番茄炒蛋',
    category: '家常菜',
    ingredients: ['番茄2个', '鸡蛋3个', '盐适量', '糖少许'],
    steps: [
      '番茄洗净切块',
      '鸡蛋打散备用',
      '锅中放油，倒入鸡蛋液炒至凝固',
      '加入番茄块翻炒',
      '加入盐和糖调味，翻炒均匀即可',
    ],
    notes: '番茄选择熟透的会更甜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20scrambled%20eggs%20chinese%20food&image_size=square',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: '麻婆豆腐',
    category: '川菜',
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
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mapo%20tofu%20sichuan%20spicy%20chinese%20food&image_size=square',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: '清蒸鲈鱼',
    category: '粤菜',
    ingredients: ['鲈鱼1条', '姜片3片', '葱段适量', '蒸鱼豉油'],
    steps: [
      '鲈鱼处理干净，在鱼身上划几刀',
      '姜片和葱段放在鱼身上和鱼肚里',
      '蒸锅加水烧开，放入鲈鱼蒸8-10分钟',
      '取出倒掉蒸出来的水',
      '淋上蒸鱼豉油，撒上葱花',
      '锅中烧热油，浇在鱼身上即可',
    ],
    notes: '蒸鱼时间根据鱼的大小调整',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=steamed%20sea%20bass%20cantonese%20chinese%20food&image_size=square',
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