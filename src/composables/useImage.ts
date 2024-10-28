/**
 * Verifica si una cadena es una URL válida
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica si una cadena es una imagen base64 válida
 */
export function isValidBase64Image(str: string): boolean {
  if (!str?.startsWith("data:image")) return false;
  try {
    return str.split(",")[1]?.length > 0;
  } catch {
    return false;
  }
}

/**
 * Asegura que la imagen base64 tenga el formato correcto
 */
export function ensureBase64Format(base64String: string): string {
  if (!base64String) return "";

  // Si ya es una URL válida, retornarla
  if (isValidUrl(base64String)) return base64String;

  // Si ya tiene el prefijo data:image, validar y retornar
  if (base64String.startsWith("data:image")) {
    return isValidBase64Image(base64String) ? base64String : "";
  }

  // Si es solo la cadena base64, agregar el prefijo
  try {
    return `data:image/jpeg;base64,${base64String.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    )}`;
  } catch {
    return "";
  }
}
