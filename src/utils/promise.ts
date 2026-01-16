// export type cancelablePromiseType = { promise: Promise<*>, cancel: () => any };
export function cancelablePromise(promise: Promise<any>) {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((val) =>
        hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
      )
      .catch((error) =>
        hasCanceled_ ? reject({ isCanceled: true }) : reject(error),
      );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
}
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
