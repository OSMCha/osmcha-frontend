import renderer from "react-test-renderer";
import { PageRange } from "./page_range.tsx";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <PageRange
        page={"<"}
        pageIndex={0}
        disabled={false}
        active={false}
        getChangesetsPage={() => {}}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders correctly", () => {
  const tree = renderer
    .create(
      <PageRange
        key={1}
        page={4}
        pageIndex={4}
        active={true}
        getChangesetsPage={() => {}}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
