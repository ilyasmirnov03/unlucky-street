/**
 * This function only exists to avoid rewriting the same type cast everywhere.
 */
export function getById<T = HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

