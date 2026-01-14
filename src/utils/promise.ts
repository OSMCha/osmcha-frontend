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

export function cancelableFetchJSON(url: string, token?: string) {
  if (token) {
    return cancelablePromise(
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Token ${token}` : "",
        },
      })
        .then(handleErrors)
        .then((res) => {
          return res.json();
        }),
    );
  } else {
    return cancelablePromise(
      fetch(url)
        .then(handleErrors)
        .then((res) => {
          return res.json();
        }),
    );
  }
}

export function delayPromise(interval: number): {
  promise: Promise<any>;
  cancel: () => any;
} {
  return cancelablePromise(new Promise((res) => setTimeout(res, interval)));
}
