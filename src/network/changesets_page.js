// @flow
import {API_URL} from '../config';
import {PAGE_SIZE} from '../config/constants';

export function networkFetchChangesets(pageIndex: number) {
  return fetch(
    `${API_URL}/changesets?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`,
  ).then(res => res.json());
}
