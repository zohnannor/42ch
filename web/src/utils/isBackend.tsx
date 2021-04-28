export function isBackend(): boolean {
  return typeof window === 'undefined';
}
