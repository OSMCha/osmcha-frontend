export { DateField } from "./date";
export { LocationSelect } from "./location";
export { Meta } from "./meta";
export { MappingTeamMultiSelect, MultiSelect } from "./multi_select";
export { Radio } from "./radio";
export { Text } from "./text";
export { Wrapper } from "./wrapper";

export type InputType = {
  label: string;
  value: string;
};

export type filterOptionsType = {
  label?: string | null;
  value?: string | null;
};

export type filterType = Array<filterOptionsType>;

export type filtersType = Record<string, filterType>;
