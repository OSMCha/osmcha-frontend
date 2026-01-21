import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_URL } from "../../config";
import { useSetTag } from "../../query/hooks/useSetTag";
import { useAuthStore } from "../../stores/authStore";
import { Dropdown } from "../dropdown";

interface TagsProps {
  changesetId: number;
  disabled: boolean;
  currentChangeset: any;
}

let cachedTagsPromise: Promise<any> | null = null;

export function Tags({ changesetId, disabled, currentChangeset }: TagsProps) {
  const [options, setOptions] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const token = useAuthStore((state) => state.token);
  const setTagMutation = useSetTag();

  useEffect(() => {
    if (!cachedTagsPromise) {
      cachedTagsPromise = fetch(`${API_URL}/tags/`)
        .then((response) => response.json())
        .catch((error) => {
          console.error("Failed to fetch tags:", error);
          return { results: [] };
        });
    }

    cachedTagsPromise
      .then((json) => {
        const selectData = json.results.filter(
          (d: any) => d.is_visible && d.for_changeset,
        );
        setOptions(
          selectData.map((d: any) => ({ label: d.name, value: d.id })),
        );
      })
      .catch((error) => {
        console.error("Error processing tags:", error);
      });
  }, []);

  const onAdd = (obj: any) => {
    if (!obj || !token) {
      if (!token) {
        toast.error("You must be logged in to add tags");
      }
      return;
    }

    setTagMutation.mutate({
      changesetId,
      tag: obj,
      remove: false,
    });
  };

  const onRemove = (obj: any) => {
    if (!obj || !token) {
      if (!token) {
        toast.error("You must be logged in to remove tags");
      }
      return;
    }

    setTagMutation.mutate({
      changesetId,
      tag: obj,
      remove: true,
    });
  };

  if (!currentChangeset || options.length === 0) return null;

  const tags = currentChangeset.properties?.tags || [];
  const value = tags.map((t: any) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <Dropdown
      multi
      onAdd={onAdd}
      onRemove={onRemove}
      disabled={disabled}
      className={`${disabled ? "cursor-notallowed" : ""} flex-parent mr3`}
      value={value}
      options={options}
      onChange={() => {}}
      display={`Tags${value.length > 0 ? ` (${value.length})` : ""}`}
      position="right"
    />
  );
}
