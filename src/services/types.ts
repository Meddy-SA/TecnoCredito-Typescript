//types.ts file

export type APIResponse<T> = {
  success: boolean
  content: T
  status?: number
  message?: string
  error?: string
}

export interface ResponseDTO<T> {
  isSuccess: boolean
  message: string
  result: T | null
  error?: string
}

export interface ErrorResponseData<T> {
  result?: T
  error?: string
  message?: string
}

export interface APIErrorMetadata {
  timestamp: string
  path?: string
  method?: string
  code?: string
  errorType: ErrorType
}

export type ErrorType = 'API' | 'NETWORK' | 'UNEXPECTED' | 'UNKNOWN'
export type NetworkErrorCode = 'ERR_NETWORK' | 'ECONNABORTED' | 'TIMEOUT'
