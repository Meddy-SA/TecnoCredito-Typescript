import { Categories, type CategoryDTO } from '../category/types'
import type { EnumDTO } from '../enumerator/types'

export type ProductDTO = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  category: CategoryDTO
  brand: string
  model: string
  sku: string
  technicalSpecifications: string
  status: EnumDTO
  productImages?: ProductImageDTO[]
}

export type ProductImageDTO = {
  id: number
  url: string
}

// Class
export class Products {
  static getDefault(): ProductDTO {
    const defaultProduct: ProductDTO = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: Categories.getDefault(),
      brand: '',
      model: '',
      sku: '',
      technicalSpecifications: '',
      status: { id: 0, name: '' } as EnumDTO,
      productImages: [],
    }
    return defaultProduct
  }
}
