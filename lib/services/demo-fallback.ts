let hasWarned = false;

export function isDemoDataEnabled(): boolean {
<<<<<<< ours
  return process.env.NODE_ENV !== "production";
=======
  return process.env.USE_DEMO_DATA === "true";
>>>>>>> theirs
}

export function shouldUseDemoData(error: unknown, operation: string): boolean {
  if (!isDemoDataEnabled()) {
    return false;
  }

<<<<<<< ours
  if (!hasWarned) {
    console.warn(
      `Database unavailable during "${operation}". Using in-memory demo data for development.`,
=======
  if (process.env.NODE_ENV !== "test" && !hasWarned) {
    console.warn(
      `Database unavailable during "${operation}". Using in-memory demo data because USE_DEMO_DATA=true.`,
>>>>>>> theirs
      error,
    );
    hasWarned = true;
  }

  return true;
}
