import http from '../api.ts';
import type { APIResponse, ResponseDTO } from '../types.ts';
import type { PrestadorDTO } from './types.ts';

const getFarmacias = async (): Promise<APIResponse<PrestadorDTO[]>> => {
  const res = await http.get<ResponseDTO<PrestadorDTO[]>>(`prestadores/farmacias`);
  if (res.data === null) {
    return { success: false, content: {} as PrestadorDTO[], status: res.status };
  }

  const r = res.data;

  return {
    success: r.success,
    content: r.result ?? {} as PrestadorDTO[],
    status: res.status
  }
}

export default {
  getFarmacias,
}
