export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  tech: string[];
  url?: string;
  github?: string;
  featured: boolean;
  createdAt: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
}