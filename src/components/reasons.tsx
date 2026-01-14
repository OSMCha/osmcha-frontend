import type { List } from "immutable";

export function Reasons({
  reasons,
  userFlag,
  underline,
  color,
}: {
  reasons: List<any>;
  userFlag?: string;
  underline?: boolean;
  color: string;
}) {
  const extraClass = underline ? "txt-underline-dotted" : "";
  return (
    <span className="mb3">
      {reasons.map((r: Map<string, any>, k) => (
        <Reason
          key={k}
          text={r.get("name")}
          color={color}
          extraClass={extraClass}
        />
      ))}
      {userFlag && (
        <Reason text={userFlag} color="purple" extraClass={extraClass} />
      )}
    </span>
  );
}

const Reason = ({
  text,
  color,
  extraClass,
}: {
  text: string;
  color: string;
  extraClass: string;
}) => (
  <span className="mr6">
    <span
      className={`color-${color}-dark inline-block bg-${color}-faint px6 txt-s txt-bold ${extraClass}`}
    >
      {text}
    </span>
  </span>
);
