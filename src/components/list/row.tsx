import React from "react";
import { PrimaryLine } from "./primary_line.tsx";
import { SecondaryLine } from "./secondary_line.tsx";
import { Title } from "./title.tsx";

/** Accessible name for a row's link, summarizing the changeset. */
function describe(changesetId: number, p: any) {
  // TODO: if we ever localize OSMCha this string will need to
  // be constructed in a less hacky way
  const parts = [
    `${p.comment || "No comment"} by ${p.user || "unknown user"} ` +
      `with ${p.create} added, ${p.modify} modified, ${p.delete} removed elements`,
    ...[...(p.reasons ?? []), ...(p.tags ?? [])].map((r: any) => r.name),
  ];
  if (p.checked) {
    parts.push(`previously reviewed ${p.harmful ? "bad" : "good"}`);
  }
  parts.push(`changeset ${changesetId}`);
  return parts.join(", ");
}

interface RowProps {
  properties: any;
  active?: boolean;
  changesetId: number;
  inputRef?: (a: any) => any;
}

export class Row extends React.Component<RowProps> {
  shouldComponentUpdate(nextProps: any) {
    return (
      nextProps.properties !== this.props.properties ||
      this.props.active ||
      nextProps.active
    );
  }

  wasOpen = false;

  render() {
    const { properties, changesetId, active, inputRef, ...other } = this.props;
    if (!this.wasOpen) {
      // way to show read/unread state without
      // performance compromise. The moment component
      // gets active we set wasOpen to true and never
      // toggle it back to any other state.
      this.wasOpen = !!this.props.active;
    }

    let borderClass = "border-l border-l--4 border-color-neutral";
    if (properties.harmful === true)
      borderClass = "border-l border-l--4 border-color-bad";
    if (properties.harmful === false)
      borderClass = "border-l border-l--4 border-color-good";

    const backgroundClass = active
      ? "changeset-row--selected"
      : this.wasOpen
        ? "changeset-row--read"
        : "";
    return (
      <li>
        <div
          className={`relative ${backgroundClass} ${borderClass}`}
          ref={inputRef}
        >
          <div
            {...other}
            className="p12 cursor-pointer flex-parent flex-parent--column border-b border-b--1 border--gray-light flex-parent flex-parent--column"
          >
            <Title properties={properties} date={properties.date} />
            <PrimaryLine
              reasons={properties.reasons}
              tags={properties.tags}
              comment={properties.comment}
            />
            <SecondaryLine
              changesetId={changesetId}
              properties={properties}
              label={describe(changesetId, properties)}
              active={!!active}
            />
          </div>
        </div>
      </li>
    );
  }
}
