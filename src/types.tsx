export interface Painting {
  id: number;
  title: string;
  collection: string;
  purchased: boolean;
  photoS: string;
  photoM: string;
  photoL: string;
  medium?: string;
  width?: number;
  height?: number;
  year?: string;
  price?: number;
  location?: string;
  order: number;
  display_price?: boolean;
}

export interface Collection {
  name: string;
  url: string;
  photo: string;
}

export const Collections = [
  "Landscapes",
  "Abstracts",
  "Portraits",
  "Still Lifes",
  "Animals",
  "Interiors",
  "Unfinished",
];
