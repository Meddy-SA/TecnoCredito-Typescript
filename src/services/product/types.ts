import type { CategoryDTO } from "../category/types";
import type { EnumDTO } from "../system/types";

import { createEmptyCategoryDTO } from "../category/types";

export type ProductDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: CategoryDTO;
  brand: string;
  model: string;
  sku: string;
  technicalSpecifications: string;
  status: EnumDTO;
  productImages?: ProductImageDTO[];
};

export type ProductImageDTO = {
  id: number;
  url: string;
};

// Función para crear un ProductDTO vacío
export const createEmptyProductDTO = (): ProductDTO => ({
  id: 0,
  name: "",
  description: "",
  price: 0,
  stockQuantity: 0,
  category: createEmptyCategoryDTO(),
  brand: "",
  model: "",
  sku: "",
  technicalSpecifications: "",
  status: { id: 0, name: "" },
  productImages: [],
});
