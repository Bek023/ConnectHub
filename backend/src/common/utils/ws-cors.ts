export function wsCorsOrigin(): string[] | boolean {
  const origins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (origins.length) return origins;
  return process.env.NODE_ENV !== 'production';
}
