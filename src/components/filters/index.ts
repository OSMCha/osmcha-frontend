export { DateField } from "./date.tsx";
export { LocationSelect } from "./location.tsx";
export { Meta } from "./meta.tsx";
export { MappingTeamMultiSelect, MultiSelect } from "./multi_select.tsx";
export { Radio } from "./radio.tsx";
export { Text } from "./text.tsx";
export { Wrapper } from "./wrapper.tsx";

type FilterOption = {
  label: string;
  value: string | number;
};

export type Filter = Array<FilterOption>;

export type Filters = Record<string, Filter>;
