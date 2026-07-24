interface SortHeaderProps<K extends string> {
  label: string;
  sortKey: K;
  active: K;
  dir: "asc" | "desc";
  onSort: (key: K) => void;
  className?: string;
}

export function SortHeader<K extends string>({
  label,
  sortKey,
  active,
  dir,
  onSort,
  className,
}: SortHeaderProps<K>) {
  const isActive = active === sortKey;
  return (
    <th
      className={`txt-s txt-uppercase cursor-pointer color-gray-dark ${className || ""}`}
      aria-sort={
        isActive ? (dir === "asc" ? "ascending" : "descending") : "none"
      }
      onClick={() => onSort(sortKey)}
    >
      {label}
      <span style={{ width: "1em", paddingLeft: "3px" }}>
        {isActive ? (dir === "asc" ? "▲" : "▼") : ""}
      </span>
    </th>
  );
}
