import Linkify from "linkify-react";
import { Reasons } from "../reasons.tsx";
import TranslateButton from "./translate_button.tsx";

export function Details({
  properties,
  changesetId,
}: {
  properties: any;
  changesetId: number;
  expanded?: boolean;
}) {
  let source = properties.source;
  const imagery = properties.imagery_used;
  const editor = properties.editor;
  const metadata = properties.metadata;
  const reasons = properties.reasons;
  const comment = properties.comment;

  if (source?.includes("{switch:a,b,c}.")) {
    source = source.replace("{switch:a,b,c}.", "");
  }

  const propertiesObj: Record<string, string> = {
    editor: editor,
    source: source,
    imagery: imagery,
  };

  for (const [p, v] of Object.entries<string>(metadata)) {
    if (
      !p.startsWith("ideditor") &&
      !p.startsWith("resolved") &&
      !p.startsWith("warnings")
    ) {
      propertiesObj[p] = v;
    }
  }

  return (
    <div>
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap py12">
        <div className="flex-parent flex-parent--row flex-parent--wrap mb3">
          <p
            className={`flex-child txt-subhead txt-l txt-break-url ${
              !comment ? "color-gray txt-em" : ""
            }`}
          >
            <Linkify
              options={{
                target: "_blank",
                rel: "noopener noreferrer",
                className: "link",
              }}
            >
              {comment ? comment : `${changesetId} does not have a comment.`}
            </Linkify>
          </p>
        </div>
        <div className="flex-parent">
          <TranslateButton text={comment} />
        </div>
      </div>
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">
        <Reasons reasons={reasons} color="blue" />
      </div>
      <table className="details-table txt-s my12">
        <tbody>
          {Object.entries(propertiesObj).map(([key, value]) => (
            <tr key={key}>
              <th scope="row" className="txt-uppercase">
                {key}
              </th>
              <td className="txt-break-url">
                <Linkify
                  options={{
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "link",
                  }}
                >
                  {value}
                </Linkify>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
