export function slugify(str: string | undefined): string {
  return str
    ? str
        .toLowerCase()
        .trim()
        // strip special characters
        .replace(/[^\w\s-]|[\s-]+/g, "")
    : "";
}

export function concatScopes(a: string, b: string): string {
  return [a, b]
    .filter((scope) => !!scope)
    .map((scope) => slugify(scope))
    .join("_");
}