import { API_URL, apiCredentials } from '../config';
import { handleErrors } from './aoi';

export function createMappingTeam(token: string, name: string, users: string) {
  return fetch(`${API_URL}/mapping-team/`, {
    method: 'POST',
    credentials: apiCredentials,
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
    credentials: apiCredentials,
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
    credentials: apiCredentials,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(handleErrors);
}

export function fetchUserMappingTeams(token: string, owner: string) {
  return fetch(`${API_URL}/mapping-team/?owner=${owner}`, {
    method: 'GET',
    credentials: apiCredentials,
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
    credentials: apiCredentials,
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
    credentials: apiCredentials,
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
