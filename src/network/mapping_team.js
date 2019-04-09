import { API_URL } from '../config';
import { handleErrors } from './aoi';

export function createMappingTeam(token: string, name: string, users: string) {
  return fetch(`${API_URL}/mapping-team/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      name,
      users
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function fetchMappingTeam(token: string, id: number) {
  return fetch(`${API_URL}/mapping-team/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
export function deleteMappingTeam(token: string, id: number) {
  return fetch(`${API_URL}/mapping-team/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(handleErrors);
}

export function fetchUserMappingTeams(token: string, owner: string) {
  return fetch(`${API_URL}/mapping-team/?owner=${owner}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function fetchTrustedMappingTeams(token: string) {
  return fetch(`${API_URL}/mapping-team/?trusted=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function updateMappingTeam(
  token: string,
  id: number,
  name: ?string,
  users: ?object
) {
  return fetch(`${API_URL}/mapping-team/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      name,
      users
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
