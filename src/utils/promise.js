// @flow
// export type cancelablePromiseType = { promise: Promise<*>, cancel: () => any };
export function cancelablePromise(promise: Promise<*>) {
  let hasCanceled_ = false;

  // promise.catch(e => console.log(e));
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)))
      .catch(
        error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
      );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
}
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function cancelableFetchJSON(url: string) {
  return cancelablePromise(
    fetch(url).then(handleErrors).then(res => {
      return res.json();
    })
  );
}

export function delayPromise(
  interval: number
): { promise: Promise<*>, cancel: () => any } {
  return cancelablePromise(new Promise(res => setTimeout(res, interval)));
}
