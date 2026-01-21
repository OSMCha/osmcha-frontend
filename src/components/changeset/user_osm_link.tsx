import type React from "react";

interface UserOSMLinkProps {
  userName?: string;
  linkClasses?: string;
  children: React.ReactNode;
}

export const UserOSMLink = ({
  userName,
  linkClasses,
  children,
}: UserOSMLinkProps) => {
  if (!userName) return null;

  const url = `https://www.openstreetmap.org/user/${userName}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Open in OSM"
      className={
        linkClasses ||
        "mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
      }
    >
      {children}
    </a>
  );
};
