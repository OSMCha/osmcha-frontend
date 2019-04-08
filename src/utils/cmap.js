// @flow
let cmap;
export function importChangesetMap(module: string): Promise<*> {
  if (cmap) return Promise.resolve(cmap[module]);
  return import('changeset-map')
    .then(function(m) {
      cmap = m;
      return cmap[module];
    })
    .catch(function(err) {
      console.error(err);
      console.log('Failed to load module changeset-map');
    });
}
