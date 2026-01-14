import { getObjAsQueryParam, getSearchObj } from "../query_params";

describe("getSearchObj", () => {
  it("with input provided.", () => {
    const search =
      "?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222017-06-28%22%2C%22value%22%3A%222017-06-28%22%7D%5D%2C%22is_suspect%22%3A%5B%7B%22label%22%3A%22Yes%22%2C%22value%22%3A%22True%22%7D%5D%2C%22reasons%22%3A%5B%7B%22label%22%3A%22mass%20modification%22%2C%22value%22%3A1%7D%5D%7D";
    const { filters } = getSearchObj(search);
    expect("date__gte" in filters).toBe(true);
    expect("is_suspect" in filters).toBe(true);
    expect("reasons" in filters).toBe(true);
    expect(Object.keys(filters).length).toBe(3);
  });
  it("without input .", () => {
    var searchObj = getSearchObj();
    expect(searchObj).toEqual({});
  });
});

describe("test getObjAsQueryParam", () => {
  it("with input provided.", () => {
    const toTest = getObjAsQueryParam();
    expect(toTest).toBe("");
  });
});
