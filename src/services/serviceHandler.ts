import { AxiosError, type AxiosResponse } from "axios";
import type { APIResponse, ResponseDTO } from "./types";

interface ErrorResponseData<T> {
  result?: T;
  error?: string;
  message?: string;
}

interface APIErrorMetadata {
  timestamp: string;
  path?: string;
  method?: string;
  code?: string;
  errorType: "API" | "NETWORK" | "UNEXPECTED" | "UNKNOWN";
}

type NetworkErrorCode = "ERR_NETWORK" | "ECONNABORTED" | "TIMEOUT";

export function handleResponseData<T>(
  response: AxiosResponse<ResponseDTO<T>>,
  defaultValue: T
): APIResponse<T> {
  if (!response.data) {
    throw new Error("No se obtuvo respuesta del servidor");
  }
  return {
    success: response.data.success,
    content: response.data.result ?? defaultValue,
    status: response.status,
    error: response.data.error,
  };
}

export function handleResWithoutDTO<T>(
  response: AxiosResponse<T>,
  defaultValue: T
): APIResponse<T> {
  if (!response.data) {
    throw new Error("No se obtuvo respuesta del servidor");
  }
  return {
    success: response.status === 200,
    content: response.data ?? defaultValue,
    status: response.status,
    error: response.statusText,
  };
}

export function handleApiError(
  error: unknown,
  context = "API Request"
): APIResponse<string | null> {
  const metadata: APIErrorMetadata = {
    timestamp: new Date().toISOString(),
    errorType: "UNKNOWN",
  };

  // Estructura común para logging
  const logApiError = (type: string, details: unknown) => {
    console.error({
      context,
      type,
      timestamp: metadata.timestamp,
      details,
    });
  };

  // Manejar errores específicos de Axios
  if (error instanceof AxiosError) {
    metadata.errorType = "API";
    metadata.path = error.config?.url;
    metadata.method = error.config?.method?.toUpperCase();
    metadata.code = error.code;

    const isNetworkError = error.code === "ERR_NETWORK";
    if (isNetworkError) {
      metadata.errorType = "NETWORK";
    }

    logApiError("API_REQUEST_ERROR", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return {
      success: false,
      status: error.response?.status ?? (isNetworkError ? 503 : 500),
      content: formatErrorMessage(error),
    };
  }

  // Manejar errores estándar de JavaScript
  if (error instanceof Error) {
    metadata.errorType = "UNEXPECTED";

    logApiError("UNEXPECTED_ERROR", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return {
      success: false,
      status: getErrorStatus(error),
      content: error.message,
    };
  }

  // Manejar errores desconocidos
  logApiError("UNKNOWN_ERROR", error);

  return {
    success: false,
    status: 500,
    content: "An unexpected error occurred",
  };
}

export function handleServiceError<T>(
  error: unknown,
  emptyContent: T,
  serviceName = "Unknown Service"
): APIResponse<T> {
  const logError = (type: string, details: unknown) => {
    console.error({
      type,
      service: serviceName,
      timestamp: new Date().toISOString(),
      details,
    });
  };

  // Handle Axios specific errors
  if (error instanceof AxiosError) {
    logError("API_ERROR", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      error: error.message,
    });
    const responseData = error.response?.data as ErrorResponseData<T>;
    const isNetworkError = (error.code as NetworkErrorCode) === "ERR_NETWORK";
    return {
      success: false,
      content: responseData?.result ?? emptyContent,
      status: error.response?.status ?? (isNetworkError ? 503 : 500),
      error: getErrorMessage<T>(responseData, error),
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    logError("UNEXPECTED_ERROR", error);
    return {
      success: false,
      content: emptyContent,
      status: getErrorStatus(error),
      error: error.message,
    };
  }

  // Handle unknown errors
  logError("UNKNOWN_ERROR", error);
  return {
    success: false,
    content: emptyContent,
    status: 500,
    error: "An unexpected error occurred",
  };
}

function getErrorMessage<T>(
  responseData: ErrorResponseData<T> | undefined,
  error: AxiosError
): string {
  if (!responseData) return error.message;

  return (
    responseData.error ??
    responseData.message ??
    error.message ??
    "An unexpected error occurred"
  );
}

function getErrorStatus(error: Error): number {
  const errorTypes: Record<string, number> = {
    TypeError: 400,
    RangeError: 416,
    SyntaxError: 400,
    ValidationError: 422,
    AuthenticationError: 401,
    AuthorizationError: 403,
  };

  return errorTypes[error.name] || 500;
}

function formatErrorMessage(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as Record<string, unknown>;
    return (
      (data.message as string) ||
      (data.error as string) ||
      error.message ||
      "Unknown API error"
    );
  }

  return error.message || "Unknown API error";
}

export function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && error.code === "ERR_NETWORK";
}
