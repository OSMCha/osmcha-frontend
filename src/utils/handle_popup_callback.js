const parseQueryString = queryString => {
  const query = {};
  queryString.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value) || null;
  });

  return query;
};

export function handlePopupCallback() {
  // TO-FIX what if it never resolves
  return new Promise((res, rej) => {
    window.authComplete = location => {
      console.log(location);
      const queryString = location.split('?')[1];
      const creds = parseQueryString(queryString);
      delete window.authComplete;
      return res(creds);
    };
  });
}
