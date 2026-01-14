import type React from "react";

interface BoxProps {
  children: React.ReactNode;
  pullDown?: any;
  pullUp?: any;
  className?: string;
  style?: React.CSSProperties;
  bg?: string;
}

export const Box = ({
  children,
  pullDown,
  pullUp,
  className = "",
  style,
  bg = "",
}: BoxProps) => (
  <div className={`mb3 z4 bg-gray-faint ${className} `} style={style}>
    <div
      className={`${bg} scroll-styled scroll-auto hmax360`}
      style={{ minHeight: "248px" }}
    >
      {children}
    </div>
  </div>
);
