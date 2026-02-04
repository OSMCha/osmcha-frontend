import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./dropdown.css";
import { Button } from "./button";

export interface DropdownOption {
  label: string;
  value?: string | number | boolean | object;
  href?: string;
}

interface DropdownProps {
  className?: string;
  disabled?: boolean;
  value?: DropdownOption[];
  onChange?: (value: DropdownOption[]) => void;
  onAdd?: (option: DropdownOption) => void;
  onRemove?: (option: DropdownOption) => void;
  options: DropdownOption[];
  display: string | React.ReactNode;
  deletable?: (value: string) => void;
  multi?: boolean;
  position?: "left" | "right";
}

interface DropdownContentProps {
  value: DropdownOption[];
  onChange: (value: DropdownOption[]) => void;
  onRemove: (obj: DropdownOption) => void;
  onAdd: (obj: DropdownOption) => void;
  options: DropdownOption[];
  multi: boolean;
  toggleDropdown: () => void;
  styles?: React.CSSProperties;
  deletable?: (value: string) => void;
}

const DropdownContent: React.FC<DropdownContentProps> = ({
  value,
  onChange,
  onRemove,
  onAdd,
  options,
  multi,
  toggleDropdown,
  styles,
  deletable,
}) => {
  const isActive = useCallback(
    (obj: DropdownOption) => {
      if (!value) return false;
      return value.some((v) => v.label === obj.label);
    },
    [value],
  );

  const handleClick = useCallback(
    (data: DropdownOption) => {
      if (!data || !data.label || !value || !onChange) return;

      const existingIndex = value.findIndex((v) => v.label === data.label);

      if (existingIndex !== -1) {
        // Remove the option
        onRemove(data);
        onChange([
          ...value.slice(0, existingIndex),
          ...value.slice(existingIndex + 1),
        ]);
      } else {
        // Add the option
        const newArray = multi ? [...value, data] : [data];
        onAdd(data);
        onChange(newArray);
      }

      if (!multi) {
        toggleDropdown();
      }
    },
    [value, onChange, onRemove, onAdd, multi, toggleDropdown],
  );

  return (
    <ul className="dropdown-content wmin96 round wmax240" style={styles}>
      {options.map((i, k) => (
        <li
          key={k}
          onClick={() => handleClick(i)}
          className="dropdown-content-item flex-parent flex-parent--row flex-parent--center-cross py6 px12"
        >
          {multi && (
            <input
              data-label={i.label}
              data-payload={JSON.stringify(i)}
              type="checkbox"
              checked={isActive(i)}
              value={i.label}
              className="cursor-pointer mt6"
              readOnly
            />
          )}
          {i.href ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={i.href}
              onClick={toggleDropdown}
              className={`txt-nowrap flex-child--grow cursor-pointer color-gray ${
                isActive(i) ? "is-active txt-bold" : ""
              }`}
            >
              {i.label}
            </a>
          ) : (
            <span
              className={`txt-nowrap flex-child--grow cursor-pointer color-gray ${
                isActive(i) ? "is-active txt-bold" : ""
              }`}
            >
              {i.label}
            </span>
          )}
          {deletable && (
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
                deletable(i.value as string);
              }}
            >
              x
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export const Dropdown: React.FC<DropdownProps> = ({
  className = "",
  disabled,
  value = [],
  onChange = () => {},
  onAdd = () => {},
  onRemove = () => {},
  options,
  display,
  deletable,
  multi = false,
  position = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Click-outside detection
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`dropdown pointer ${className}`}>
      <Button
        iconName="chevron-down"
        onClick={toggleDropdown}
        className="wmin96"
        disabled={disabled}
      >
        <span>{display}</span>
      </Button>
      {isOpen && (
        <DropdownContent
          value={value}
          onChange={onChange}
          onAdd={onAdd}
          onRemove={onRemove}
          options={options}
          multi={multi}
          toggleDropdown={toggleDropdown}
          styles={position === "right" ? { right: 0 } : { left: 0 }}
          deletable={deletable}
        />
      )}
    </div>
  );
};
