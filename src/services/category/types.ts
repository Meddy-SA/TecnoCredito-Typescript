export type CategoryDTO = {
  id: number
  name: string
  description: string
  parentCategory?: CategoryDTO
  isActive: boolean
}

export class Categories {
  static getDefault(): CategoryDTO {
    const defaultCategory: CategoryDTO = {
      id: 0,
      name: '',
      description: '',
      parentCategory: undefined,
      isActive: false,
    }
    return defaultCategory
  }
}
