import { statusUrl } from '../config/constants';
import { handleErrors } from './aoi';

export function getStatus(input, type): Promise<*> {
  return fetch(`${statusUrl}`, {
    method: 'GET'
  })
    .then(handleErrors)
    .then(response => {
      return response.json();
    });
}
