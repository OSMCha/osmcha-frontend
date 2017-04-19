// @flow

/**
 * Wraps localStorage.getItem in a try/catch
 * Returns null if localStorage fails or does not have the key
 *
 * @param {string} key
 */
function getItem(key: string): ?string {
  try {
    return localStorage.getItem(key) || null;
  } catch (err) {
    console.warn('Could not read from localStorage.');
    return null;
  }
}

/**
 * Wraps localStorage.setItem in a try/catch
 * Stringify a value before calling setItem
 *
 * @param {string} key
 * @param {string} value
 */
function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn('Could not write to localStorage.');
  }
}

/**
 * Wraps localStorage.removeItem in a try/catch
 *
 * @param {string} key
 */
function removeItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Could not delete from localStorage.');
  }
}

export {getItem, setItem, removeItem};
