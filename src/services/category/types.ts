export type CategoryDTO = {
  id: number;
  name: string;
  description: string;
  parentCategory?: CategoryDTO;
};

export const createEmptyCategoryDTO = (): CategoryDTO => ({
  id: 0,
  name: "",
  description: "",
});
