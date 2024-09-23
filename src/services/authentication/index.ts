import http from "../api.ts";
import type { APIResponse, ResponseData } from "../types.ts";
import type { LoginDto, UserData } from "./types.ts";

async function login(credentials: LoginDto): Promise<APIResponse<UserData>> {
  const res = await http.post<ResponseData<UserData>>(
    "user/login",
    credentials
  );

  if (res.data === null || res.data.response === null) {
    return { success: false, content: {} as UserData, status: res.status };
  }

  const r = res.data.response;

  return {
    success: r.success,
    content: r.result ?? ({} as UserData),
    status: res.status,
  };
}

export default {
  login,
};
