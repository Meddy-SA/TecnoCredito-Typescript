import { BaseService } from '../base.service'
import type { APIResponse } from '../types'
import type { CategoryDTO } from './types'

class CategoryService extends BaseService {
  constructor() {
    super('category')
  }

  async getCategories(): Promise<APIResponse<CategoryDTO[]>> {
    return await this.get<CategoryDTO[]>('get', [] as CategoryDTO[])
  }

  async getCategoryById(id: number): Promise<APIResponse<CategoryDTO>> {
    return await this.get<CategoryDTO>(`get/${id}`, {} as CategoryDTO)
  }

  async createCategory(categoryData: CategoryDTO): Promise<APIResponse<CategoryDTO>> {
    return await this.post<CategoryDTO>('post', categoryData, {} as CategoryDTO)
  }

  async updateCategory(id: number, categoryData: CategoryDTO): Promise<APIResponse<CategoryDTO>> {
    return await this.put<CategoryDTO>(`put/${id}`, categoryData, {} as CategoryDTO)
  }
}

export const categoryService = new CategoryService()
