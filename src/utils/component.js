// @flow
export function getDisplayName(WrappedComponent: Object): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
