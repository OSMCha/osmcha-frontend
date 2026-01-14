import { Reasons } from "../reasons";

type FeatureData = {
  osm_id: number;
  name?: string;
  note?: string;
  reasons: number[] | Array<{ id: number }>;
  user_flag?: string;
  type: string;
  id: number;
  url: string;
};

type ChangesetReason = {
  id: number;
};

const Feature = ({
  data,
  changesetReasons,
  setHighlight,
  zoomToAndSelect,
}: {
  data: FeatureData;
  changesetReasons: ChangesetReason[];
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}) => {
  let reasons;
  if (data.reasons.length && typeof data.reasons[0] === "number") {
    reasons = changesetReasons.filter((reason) =>
      (data.reasons as number[]).includes(reason.id),
    );
  } else {
    reasons = data.reasons;
  }
  return (
    <tr className="txt-s">
      <td>{data.osm_id}</td>
      <td>{data.name}</td>
      <td>
        {data.note ? (
          <abbr title={data.note}>
            <Reasons
              reasons={reasons}
              userFlag={data.user_flag}
              underline={true}
              color="blue"
            />
          </abbr>
        ) : (
          <Reasons reasons={reasons} color="blue" userFlag={data.user_flag} />
        )}
      </td>
      <td>
        <span
          className="cursor-pointer txt-underline-on-hover txt-bold mr6"
          role="button"
          tabIndex={0}
          onMouseEnter={() => setHighlight(data.type, data.id, true)}
          onMouseLeave={() => setHighlight(data.type, data.id, false)}
          onFocus={() => setHighlight(data.type, data.id, true)}
          onBlur={() => setHighlight(data.type, data.id, false)}
          onClick={() => zoomToAndSelect(data.type, data.id)}
        >
          Map
        </span>
        <strong className="cursor-pointer txt-underline-on-hover">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`http://localhost:8111/load_object?objects=${
              data.url?.charAt(0) || ""
            }${data.osm_id}`}
          >
            JOSM
          </a>
        </strong>
      </td>
    </tr>
  );
};

type ReviewedFeature = {
  id: string;
  user: string;
};

type Properties = {
  features: FeatureData[];
  reviewed_features: ReviewedFeature[];
  reasons: ChangesetReason[];
};

export function Features({
  properties,
  changesetId,
  setHighlight,
  zoomToAndSelect,
}: {
  properties: Properties;
  changesetId: number;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}) {
  let features: FeatureData[] = [...properties.features];
  const reviewedFeatures: FeatureData[] = properties.reviewed_features.map(
    (feature) => ({
      url: feature.id,
      user_flag: `Flagged by ${feature.user}`,
      osm_id: Number.parseInt(feature.id.split("-")[1]),
      reasons: [],
      type: "",
      id: 0,
    }),
  );
  const reviewedIds = reviewedFeatures.map((feature) => feature.url);
  const featuresIds = features.map((feature) => feature.url);
  const intersection = features
    .map((feature, k) => [k, feature.url] as [number, string])
    .filter(([_, url]) => reviewedIds.includes(url));

  for (const [index, url] of intersection) {
    const reviewedFeature = reviewedFeatures.find((f) => f.url === url);
    if (reviewedFeature) {
      features[index] = {
        ...features[index],
        user_flag: reviewedFeature.user_flag,
      };
    }
  }

  features = features.concat(
    reviewedFeatures.filter((feature) => !featuresIds.includes(feature.url)),
  );

  return (
    <div className="px12 py6">
      <div>
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          Flagged Features
          {features.length > 0 && (
            <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
              {features.length}
            </strong>
          )}
        </h2>
        {features.length === 0 ? (
          <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
            <svg className="icon icon--xxl color-darken25">
              <use xlinkHref="#icon-alert" />
            </svg>
            <p className="txt-m">{`No features were flagged for ${changesetId}.`}</p>
          </div>
        ) : (
          <table className="table osmcha-custom-table my12">
            <thead>
              <tr className="txt-s txt-uppercase">
                <th>OSM Id</th>
                <th>Name</th>
                <th>Reasons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, k) => (
                <Feature
                  key={k}
                  data={f}
                  changesetReasons={properties.reasons}
                  setHighlight={setHighlight}
                  zoomToAndSelect={zoomToAndSelect}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
