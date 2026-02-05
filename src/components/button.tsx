interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  iconName?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
}

export function Button({
  onClick,
  children,
  iconName,
  className,
  disabled,
  title,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${
        className || ""
      } btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition ${
        iconName && children ? "pl12 pr6" : ""
      }`}
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
