import { BaseService } from '../base.service'
import type { APIResponse } from '../types'
import type { ProductDTO } from './types'

class ProductService extends BaseService {
  constructor() {
    super('product')
  }

  async getProducts(): Promise<APIResponse<ProductDTO[]>> {
    return await this.get<ProductDTO[]>('get', [] as ProductDTO[])
  }

  async createProduct(product: ProductDTO): Promise<APIResponse<ProductDTO>> {
    return await this.post<ProductDTO>('add', product, {} as ProductDTO)
  }

  async updateProduct(id: number, product: ProductDTO): Promise<APIResponse<ProductDTO[]>> {
    return await this.put<ProductDTO[]>(`update/${id}`, product, [] as ProductDTO[])
  }
}

export const productService = new ProductService()
