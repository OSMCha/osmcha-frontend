// @flow
const get = (key: string): ?Object => {
  try {
    const serializedValue: ?string = localStorage.getItem(key);
    if (typeof serializedValue === 'string') {
      return JSON.parse(serializedValue);
    }
    return null;
  } catch (err) {
    console.error('Could not read from localStorage.');
    return null;
  }
};

const set = (key: string, value: Object) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error('Could not write to localStorage.');
  }
};

const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Could not delete from localStorage.');
  }
};

const safeStorage = {
  get,
  set,
  remove,
};

export default safeStorage;
