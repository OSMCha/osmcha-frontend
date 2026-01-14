export function getSearchObj(searchParam: string = ""): any {
  let result: any = {};
  try {
    const params = new URLSearchParams(searchParam);
    result = Object.fromEntries(params.entries());
    if (result.filters) {
      result.filters = JSON.parse(result.filters);
    }
  } catch (e) {
    console.error(e);
  }
  return result;
}

export function getObjAsQueryParam(key: string, obj: any) {
  if (!obj || Object.keys(obj).length === 0) {
    return "";
  }
  const params = new URLSearchParams();
  params.set(key, JSON.stringify(obj));
  return params.toString();
}
