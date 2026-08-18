/**
 * Groups the items of an iterable by the key returned by keyFn, preserving
 * insertion order both between and within groups.
 *
 * Equivalent to the standard Map.groupBy (and to Object.groupBy, except that
 * keys aren't coerced to strings). It's implemented here because those are
 * ES2024 and we target older browsers; see build.target in vite.config.js.
 */
export function groupBy<T, K>(
  items: Iterable<T>,
  keyFn: (item: T) => K,
): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }
  return groups;
}
