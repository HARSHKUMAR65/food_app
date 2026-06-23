import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function jsonError(
  error: string,
  status: number,
  issues?: unknown,
): NextResponse {
  return NextResponse.json(
    issues === undefined ? { error } : { error, issues },
    { status },
  );
}
