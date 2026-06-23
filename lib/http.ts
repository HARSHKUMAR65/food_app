export function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallback;
}

export async function readResponseError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const payload: unknown = await response.json();
    return getErrorMessage(payload, fallback);
  } catch {
    return fallback;
  }
}
