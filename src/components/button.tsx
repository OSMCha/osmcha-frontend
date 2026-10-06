interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  iconName?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit";
}

export function Button({
  onClick,
  children,
  iconName,
  className,
  disabled,
  title,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${
        className || ""
      } btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover transition ${
        disabled ? "" : "color-gray"
      } ${iconName && children ? "pl12 pr6" : ""}`}
    >
      {children}
      {iconName && (
        <svg
          className={`icon w18 h18 inline-block align-middle ${
            children ? "pl3 pb3" : "pb3"
          }`}
        >
          <use xlinkHref={`#icon-${iconName}`} />
        </svg>
      )}
    </button>
  );
}
