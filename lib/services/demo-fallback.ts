let hasWarned = false;

export function isDemoDataEnabled(): boolean {
  return process.env.USE_DEMO_DATA === "true";
}

export function shouldUseDemoData(error: unknown, operation: string): boolean {
  if (!isDemoDataEnabled()) {
    return false;
  }

  if (process.env.NODE_ENV !== "test" && !hasWarned) {
    console.warn(
      `Database unavailable during "${operation}". Using in-memory demo data because USE_DEMO_DATA=true.`,
      error,
    );
    hasWarned = true;
  }

  return true;
}
