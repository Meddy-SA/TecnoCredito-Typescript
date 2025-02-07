import type { AxiosResponse } from 'axios'
import type { APIResponse, ResponseDTO } from './types'

export class ResponseHandler {
  static handleWithDTO<T>(
    response: AxiosResponse<ResponseDTO<T>>,
    defaultValue: T
  ): APIResponse<T> {
    this.validateResponse(response)

    return {
      success: response.data.isSuccess,
      content: response.data.result ?? defaultValue,
      status: response.status,
      error: response.data.error,
    }
  }

  static handleWithoutDTO<T>(response: AxiosResponse<T>, defaultValue: T): APIResponse<T> {
    this.validateResponse(response)

    return {
      success: response.status === 200,
      content: response.data ?? defaultValue,
      status: response.status,
      error: response.statusText,
    }
  }

  private static validateResponse<T>(response: AxiosResponse<T>): void {
    if (!response.data) {
      throw new Error('No se obtuvo respuesta del servidor')
    }
  }
}
