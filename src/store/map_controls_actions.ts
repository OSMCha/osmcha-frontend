export const MAPCONTROLS = {
  setStyle: 'SET_STYLE',
};

export function action(type: string, payload?: any | null) {
  return { type, ...payload };
}

export const updateStyle = (style: string) =>
  action(MAPCONTROLS.setStyle, { style });
