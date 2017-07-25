import { whosThat } from '../config/constants';
import { handleErrors } from './aoi';

export function getUsers(input): Promise<*> {
  return fetch(`${whosThat}?action=names&q=${input}`, {
    method: 'GET'
  })
    .then(handleErrors)
    .then(response => {
      return response.json();
    });
}
