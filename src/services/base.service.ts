import http from './api.ts'
import type { APIResponse, ResponseDTO } from './types'
import { ErrorHandler } from './error-handler.service'
import { ResponseHandler } from './response-handler.service'

export abstract class BaseService {
  protected constructor(protected readonly baseURL: string) {}

  protected async get<T>(endpoint: string, defaultValue: T): Promise<APIResponse<T>> {
    try {
      const response = await http.get<ResponseDTO<T>>(`${this.baseURL}/${endpoint}`)
      return ResponseHandler.handleWithDTO<T>(response, defaultValue)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  protected async post<T>(
    endpoint: string,
    payload: unknown,
    defaultValue: T
  ): Promise<APIResponse<T>> {
    try {
      const response = await http.post<ResponseDTO<T>>(`${this.baseURL}/${endpoint}`, payload)
      return ResponseHandler.handleWithDTO<T>(response, defaultValue)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }

  protected async put<T>(
    endpoint: string,
    payload: unknown,
    defaultValue: T
  ): Promise<APIResponse<T>> {
    try {
      const response = await http.put<ResponseDTO<T>>(`${this.baseURL}/${endpoint}`, payload)
      return ResponseHandler.handleWithDTO<T>(response, defaultValue)
    } catch (error) {
      return ErrorHandler.handleError(error)
    }
  }
}
