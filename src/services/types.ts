//types.ts file

export type APIResponse<T> = {
  success: boolean;
  content: T;
  status?: number;
  message?: string;
};

export interface ResponseDTO<T> {
  success: boolean;
  message: string;
  result: T | null;
}

export type ResponseData<T> = {
  response: ResponseDTO<T>;
  status?: number;
};
