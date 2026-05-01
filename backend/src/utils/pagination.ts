export function parsePagination(limit?: string, offset?: string) {
  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const parsedOffset = Math.max(Number(offset) || 0, 0);

  return { limit: parsedLimit, offset: parsedOffset };
}
