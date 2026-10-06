import { type RefObject, useEffect, useState } from "react";

export type Element = { type: string; id: number };

/** String key identifying an OSM element, e.g. "way/123". */
export const elementKey = (type: string, id: number) => `${type}/${id}`;

function reveal(
  open: Set<string>,
  groups: Array<[string, Element[]]>,
  selected: string | null,
) {
  const containing = groups
    .filter(([_, els]) =>
      els.some((e) => elementKey(e.type, e.id) === selected),
    )
    .map(([key]) => key);
  if (containing.length === 0 || containing.some((key) => open.has(key))) {
    return open;
  }
  return new Set(open).add(containing[0]);
}

/**
 * Tracks which groups of a collapsible element list are expanded. Whenever the
 * selected element changes (and on mount), if no expanded group contains it,
 * the first group that does is expanded.
 */
export function useOpenGroups(
  groups: Array<[string, Element[]]>,
  selected: string | null,
) {
  const [open, setOpen] = useState(() =>
    reveal(new Set<string>(), groups, selected),
  );
  const [prevSelected, setPrevSelected] = useState(selected);

  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setOpen(reveal(open, groups, selected));
  }

  const toggle = (key: string) => {
    const next = new Set(open);
    if (!next.delete(key)) next.add(key);
    setOpen(next);
  };

  return {
    isOpen: (key: string) => open.has(key),
    toggle,
    allOpen: groups.length > 0 && groups.every(([key]) => open.has(key)),
    setAllOpen: (value: boolean) =>
      setOpen(new Set(value ? groups.map(([key]) => key) : [])),
  };
}

/**
 * When the selected element changes (and on mount), scrolls the first rendered
 * entry for it (marked with aria-current="true") within the container into
 * view, unless some entry for it is already visible.
 */
export function useScrollToSelected(
  ref: RefObject<HTMLElement | null>,
  selected: string | null,
) {
  useEffect(() => {
    if (!selected || !ref.current) return;
    const items = [
      ...ref.current.querySelectorAll<HTMLElement>('[aria-current="true"]'),
    ].filter((el) => el.getClientRects().length > 0);
    if (items.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      observer.disconnect();
      if (!entries.some((e) => e.isIntersecting)) {
        items[0].scrollIntoView({ block: "nearest" });
      }
    });
    for (const el of items) observer.observe(el);
    return () => observer.disconnect();
  }, [ref, selected]);
}
