/**
 * Profile module types
 */

export interface Profile {
  userId: string;
  bio: string;
  theme: string;
  avatar?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Link {
  id: string;
  userId: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  active: boolean;
  createdAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  colors: Record<string, string>;
}
