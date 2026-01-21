import type React from "react";
import { isMobile } from "../utils/isMobile";

interface NavbarProps {
  className?: string;
  title?: React.ReactNode;
  titleClassName?: string;
  buttons?: React.ReactNode;
  buttonsClassName?: string;
}

export function Navbar({
  className = "",
  title,
  titleClassName = "",
  buttons,
  buttonsClassName = "",
}: NavbarProps) {
  const mobile = isMobile();

  return (
    <nav
      className={`
        ${mobile ? "h40" : "h55 flex-parent--center-cross"}
        flex-parent px12 py6 bg-gray-dark justify--space-between ${className}
      `}
    >
      <div className={`flex-child flex-child--grow ${titleClassName}`}>
        {title || ""}
      </div>
      <div className={`flex-child ${buttonsClassName}`}>{buttons}</div>
    </nav>
  );
}
