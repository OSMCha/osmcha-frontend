import { nominatimUrl } from '../config/constants';
import { handleErrors } from './aoi';

export function nominatimSearch(input, type): Promise<any> {
  return fetch(
    `${nominatimUrl}?polygon_geojson=1&format=json&${type}=${input}`,
    {
      method: 'GET',
    }
  )
    .then(handleErrors)
    .then((response) => {
      return response.json();
    });
}
