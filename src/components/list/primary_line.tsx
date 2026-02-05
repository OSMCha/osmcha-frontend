import { Reasons } from "../reasons.tsx";

interface PrimaryLineProps {
  reasons: any[];
  comment: string;
  tags: any[];
}

export function PrimaryLine({ reasons, comment, tags }: PrimaryLineProps) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-3-lines my6 txt-break-url">{comment}</p>
      <Reasons reasons={reasons} color="blue" />
      <Reasons reasons={tags} color="red" />
    </span>
  );
}
