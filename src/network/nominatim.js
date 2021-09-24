import { nominatimBaseUrl, nominatimCredentials } from '../config/constants';
import { handleErrors } from './aoi';

export function nominatimSearch(input, type): Promise<*> {
  return fetch(
    `${nominatimBaseUrl}/search.php?polygon_geojson=1&format=json&${type}=${input}`,
    {
      credentials: nominatimCredentials,
      method: 'GET'
    }
  )
    .then(handleErrors)
    .then(response => {
      return response.json();
    });
}
