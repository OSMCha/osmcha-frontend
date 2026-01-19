import { useEffect } from "react";

export function About() {
  useEffect(() => {
    window.location.href =
      "https://github.com/OSMCha/osmcha-frontend/blob/main/ABOUT.md";
  }, []);

  return null;
}
