// lib/types.ts

export interface Link {
  id: string;
  url: string;
  title?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}
