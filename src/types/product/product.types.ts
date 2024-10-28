import type { CategoryDTO } from "../../services/category/types";
import type { EnumDTO } from "../../services/enumerator/types";
import type { ProductDTO } from "../../services/product/types";
import type { GalleryImage, UploadedFile } from "../../views/products/types";
import { FilterMatchMode } from "@primevue/core/api";

export interface ProductFilters {
  global: {
    value: string | null;
    matchMode: string;
  };
}

export interface ProductEvents {
  onEdit: (product: ProductDTO) => void;
  onDelete: (product: ProductDTO) => void;
  onSave: (product: ProductDTO) => void;
  onCancel: () => void;
}

export interface TableState {
  selectedProducts: ProductDTO[];
  currentProduct: ProductDTO | null;
  isDialogVisible: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProductFormData {
  product: ProductDTO;
  categories: CategoryDTO[];
  statuses: EnumDTO[];
  uploadedImages: GalleryImage[];
  selectedFiles: UploadedFile[];
}

export const DEFAULT_TABLE_STATE: TableState = {
  selectedProducts: [],
  currentProduct: null,
  isDialogVisible: false,
  isLoading: false,
  error: null,
};

export const SEVERITY_MAP: Record<string, string> = {
  ACTIVE: "success",
  INACTIVE: "danger",
  PENDING: "warning",
};

export const INITIAL_FILTERS: ProductFilters = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};
