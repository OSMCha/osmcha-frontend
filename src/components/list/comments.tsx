export function NumberOfComments({ count }: { count?: number }) {
  const displayCount = count ?? 0;
  return (
    <span
      className="changeset-row-above mr6"
      title={`${displayCount} comment${displayCount > 1 ? "s" : ""}`}
    >
      <span>{displayCount}</span>
      <svg className="icon h18 w18 inline-block align-middle color-darken50">
        <use xlinkHref="#icon-contact" />
      </svg>
    </span>
  );
}
