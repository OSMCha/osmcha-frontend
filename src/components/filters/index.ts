export { DateField } from "./date";
export { LocationSelect } from "./location";
export { Meta } from "./meta";
export { MappingTeamMultiSelect, MultiSelect } from "./multi_select";
export { Radio } from "./radio";
export { Text } from "./text";
export { Wrapper } from "./wrapper";

type FilterOption = {
  label: string;
  value: string | number;
};

export type Filter = Array<FilterOption>;

export type Filters = Record<string, Filter>;
