import type React from "react";

export interface Tab {
  binding: { label: string; bindings: string[] };
  title: string;
  icon: string;
  /** Render the icon dimmed, to indicate that the tab has no content */
  empty?: boolean;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string | null;
  onToggle: (id: string) => void;
}

/**
 * Vertical tab strip with an attached content panel. Clicking the active tab
 * collapses the panel, leaving only the strip visible.
 */
export function Tabs({ tabs, activeId, onToggle }: TabsProps) {
  const active = tabs.find((t) => t.binding.label === activeId);
  return (
    <div className="changeset-tabs">
      <div
        className="changeset-tabs-list"
        role="tablist"
        aria-orientation="vertical"
      >
        {tabs.map((t) => {
          const id = t.binding.label;
          const selected = id === activeId;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls={selected ? `tabpanel-${id}` : undefined}
              title={`${t.title} (${t.binding.bindings[0]})`}
              className={`changeset-tab ${t.empty ? "changeset-tab--empty" : ""}`}
              onClick={() => onToggle(id)}
            >
              <svg className="icon h18 w18">
                <use xlinkHref={`#icon-${t.icon}`} />
              </svg>
            </button>
          );
        })}
      </div>
      {active && (
        <div
          role="tabpanel"
          id={`tabpanel-${active.binding.label}`}
          aria-labelledby={`tab-${active.binding.label}`}
          className="changeset-tabs-panel responsive-box scroll-styled"
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
