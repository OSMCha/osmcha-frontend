// @flow
export type cancelablePromiseType = { promise: Promise<*>, cancel: () => any };
export function cancelablePromise(promise: Promise<*>) {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val))
    );
    promise.catch(
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

export function delayPromise(
  interval: number
): { promise: Promise<*>, cancel: () => any } {
  return cancelablePromise(new Promise(res => setTimeout(res, interval)));
}
