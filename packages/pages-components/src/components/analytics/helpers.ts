export function slugify(str: string): string {
  return str ? str.toLowerCase().trim().replace(/\s/g, "") : "";
}

export function concatScopes(a: string, b: string): string {
  return [a, b]
    .filter((scope) => !!scope)
    .map((scope) => slugify(scope))
    .join("_");
}
