import { Reasons } from "../reasons.tsx";

interface PrimaryLineProps {
  reasons: any[];
  comment: string;
  tags: any[];
}

export function PrimaryLine({ reasons, comment, tags }: PrimaryLineProps) {
  return (
    <div className="flex-parent flex-parent--column">
      <p className="flex-child my6 txt-break-url">{comment}</p>
      <Reasons reasons={reasons} color="blue" />
      <Reasons reasons={tags} color="red" />
    </div>
  );
}
