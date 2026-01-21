import React from "react";
import { Link } from "react-router";
import { PrimaryLine } from "./primary_line";
import { SecondaryLine } from "./secondary_line";
import { Title } from "./title";

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

    let backgroundClass = "";

    backgroundClass += active ? "light-blue" : this.wasOpen ? "bg-darken5" : "";
    return (
      <div>
        <div className={`${backgroundClass} ${borderClass}`} ref={inputRef}>
          <div
            {...other}
            className="p12 cursor-pointer flex-parent flex-parent--column border-b border-b--1 border--gray-light flex-parent flex-parent--column"
          >
            <Link
              to={{
                search: window.location.search,
                pathname: `/changesets/${changesetId}`,
              }}
            >
              <Title
                properties={properties}
                wasOpen={this.wasOpen}
                date={properties.date}
              />
              <PrimaryLine
                reasons={properties.reasons}
                tags={properties.tags}
                comment={properties.comment}
              />
            </Link>
            <SecondaryLine
              changesetId={changesetId}
              properties={properties}
              date={properties.date}
            />
          </div>
        </div>
      </div>
    );
  }
}
