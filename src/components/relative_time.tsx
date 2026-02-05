import { formatDistanceToNow } from "date-fns";

interface RelativeTimeProps {
  datetime: Date;
  addSuffix?: boolean;
}

export function RelativeTime({
  datetime,
  addSuffix = true,
}: RelativeTimeProps) {
  return (
    <time dateTime={datetime.toISOString()} title={datetime.toString()}>
      {formatDistanceToNow(datetime, { addSuffix })}
    </time>
  );
}
