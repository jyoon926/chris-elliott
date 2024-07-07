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
}

export interface Collection {
  name: string;
  url: string;
  photo: string;
}