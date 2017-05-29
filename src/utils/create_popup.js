export function createPopup(
  title: string = 'Authentication',
  location: string
) {
  const width = 500;
  const height = 600;
  const settings = [
    ['width', width],
    ['height', height],
    ['left', screen.width / 2 - width / 2],
    ['top', screen.height / 2 - height / 2]
  ]
    .map(x => x.join('='))
    .join(',');

  const popup = window.open('about:blank', title, settings);
  popup.location = location;
}
