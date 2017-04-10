const get = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return undefined;
    }
    return JSON.parse(serializedValue);
  } catch (err) {
    console.error('Could not read from localStorage.');
    return undefined;
  }
};

const set = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error('Could not write to localStorage.');
  }
};

const remove = (key) => {
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
