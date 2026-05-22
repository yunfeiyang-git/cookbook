export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: string[];
  steps: string[];
  notes: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}