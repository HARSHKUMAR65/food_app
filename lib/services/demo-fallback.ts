let hasWarned = false;

export function isDemoDataEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function shouldUseDemoData(error: unknown, operation: string): boolean {
  if (!isDemoDataEnabled()) {
    return false;
  }

  if (!hasWarned) {
    console.warn(
      `Database unavailable during "${operation}". Using in-memory demo data for development.`,
      error,
    );
    hasWarned = true;
  }

  return true;
}
