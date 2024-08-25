import { AxiosError } from "axios";
import type { APIResponse } from "./types";

export function handleApiError(error: unknown): APIResponse<string | null> {
  if (error instanceof AxiosError) {
    console.log('API Error:', error);
    return {
      success: false,
      status: error.response?.status ?? error.code === "ERR_NETWORK" ? 503 : 500,
      content: error.message
    };
  }

  if (error instanceof Error) {
    console.log('Unexpected error:', error);
    return {
      success: false,
      status: 500,
      content: error.message
    };
  }

  console.log('Unknown error:', error);
  return {
    success: false,
    status: 500,
    content: null
  };
}
