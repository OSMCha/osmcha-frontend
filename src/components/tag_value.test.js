import { createElement } from "react";
import renderer from "react-test-renderer";
import { TagValue } from "./tag_value.tsx";

describe("TagValue", () => {
  it.each`
    tag                                                 | expected
    ${"highway=primary"}                                | ${[]}
    ${"wikidata=Q123"}                                  | ${["https://www.wikidata.org/entity/Q123"]}
    ${"wikidata=Q123;Q456"}                             | ${["https://www.wikidata.org/entity/Q123", "https://www.wikidata.org/entity/Q456"]}
    ${"contact:instagram=bob"}                          | ${["https://www.instagram.com/bob/"]}
    ${"contact:instagram=https://instagr.am/bob"}       | ${["https://instagr.am/bob"]}
    ${"contact:instagram=alice;https://instagr.am/bob"} | ${["https://www.instagram.com/alice/", "https://instagr.am/bob"]}
    ${"website=http://example.com"}                     | ${["http://example.com"]}
    ${"ref:FR:CEF=1234"}                                | ${["https://messes.info/lieu/1234"]}
  `("$tag", ({ tag, expected }) => {
    const [k, v] = tag.split("=");
    const container = renderer.create(createElement(TagValue, { k, v }));

    const actual = container.root.findAllByType("a");
    expect(actual).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i++) {
      expect(actual[i].props.href).toStrictEqual(expected[i]);
    }
  });
});
