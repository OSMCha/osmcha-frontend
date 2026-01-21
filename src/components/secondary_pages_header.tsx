import { isMobile } from "../utils";
import { Avatar } from "./avatar";

interface SecondaryPagesHeaderProps {
  title: string;
  avatar?: string;
}

export function SecondaryPagesHeader({
  title,
  avatar,
}: SecondaryPagesHeaderProps) {
  const mobile = isMobile();

  return (
    <header
      className={`h55 hmin55 flex-parent ${
        mobile ? "px12" : "px30"
      } bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1`}
    >
      <span className="txt-l txt-bold color-gray--dark">
        <span className="fl">
          <Avatar size={36} url={avatar} />
        </span>
        <span className="pl6 line45">{title}</span>
      </span>
    </header>
  );
}
