import Linkify from "linkify-react";
import { useState } from "react";
import { Reasons } from "../reasons.tsx";
import PropertyList from "./property_list.tsx";
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

  let propertiesObj = {};
  // As JOSM doesn't use the imagery field, change the order
  // to make the source field visible in the first page
  if (imagery === "Not reported") {
    propertiesObj = {
      editor: editor,
      source: source,
      imagery: imagery,
    };
  } else {
    propertiesObj = {
      editor: editor,
      imagery: imagery,
      source: source,
    };
  }

  for (const [p, v] of Object.entries(metadata)) {
    if (
      !p.startsWith("ideditor") &&
      !p.startsWith("resolved") &&
      !p.startsWith("warnings")
    ) {
      propertiesObj[p] = v;
    }
  }

  const size = Object.keys(propertiesObj).length;
  const [leftLimit, setLeftLimit] = useState(0);

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
      <div className="grid pt12 pb6">
        {leftLimit > 0 && (
          <button
            className="wmax12 mr6"
            onClick={() => setLeftLimit(leftLimit - 2)}
            title="Previous changeset properties"
          >
            <svg className="icon">
              <use xlinkHref="#icon-chevron-left" />
            </svg>
          </button>
        )}
        <PropertyList properties={propertiesObj} limit={leftLimit} />
        {leftLimit + 2 < size && (
          <button
            className="wmax12 ml6"
            onClick={() => setLeftLimit(leftLimit + 2)}
            title="Next changeset properties"
          >
            <svg className="icon">
              <use xlinkHref="#icon-chevron-right" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
