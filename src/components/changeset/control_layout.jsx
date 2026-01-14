import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_GEOMETRY_CHANGES,
  CHANGESET_DETAILS_MAP,
  CHANGESET_DETAILS_OTHER_FEATURES,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_TAGS,
  CHANGESET_DETAILS_USER,
} from "../../config/bindings";
import { Control } from "./control";
import { Floater } from "./floater";

export function ControlLayout({
  bindingsState,
  features,
  discussions,
  toggleDetails,
  toggleFeatures,
  toggleOtherFeatures,
  toggleGeometryChanges,
  toggleTags,
  toggleDiscussions,
  toggleUser,
  toggleMapOptions,
}) {
  return (
    <Floater
      style={{
        marginTop: 8,
        marginLeft: 5,
      }}
    >
      <Control
        active={bindingsState[CHANGESET_DETAILS_DETAILS.label]}
        onClick={toggleDetails}
        className="unround-r unround-bl"
      >
        <svg className="icon h18 w18 inline-block align-middle ">
          <use xlinkHref="#icon-eye" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_SUSPICIOUS.label]}
        onClick={toggleFeatures}
        className="unround"
      >
        <svg
          className={`icon h18 w18 inline-block align-middle ${
            features && features.length === 0 ? "color-darken25" : "color-black"
          }`}
        >
          <use xlinkHref="#icon-alert" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_TAGS.label]}
        onClick={toggleTags}
        className="unround"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-hash" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_GEOMETRY_CHANGES.label]}
        onClick={toggleGeometryChanges}
        className="unround"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-point-line" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_OTHER_FEATURES.label]}
        onClick={toggleOtherFeatures}
        className="unround"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-plus" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_DISCUSSIONS.label]}
        onClick={toggleDiscussions}
        className="unround"
      >
        <svg
          className={`icon h18 w18 inline-block align-middle ${
            discussions.length === 0 ? "color-darken25" : "color-black"
          }`}
        >
          <use xlinkHref="#icon-contact" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_USER.label]}
        onClick={toggleUser}
        className="unround"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-user" />
        </svg>
      </Control>
      <Control
        active={bindingsState[CHANGESET_DETAILS_MAP.label]}
        onClick={toggleMapOptions}
        className="unround-r unround-tl"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-map" />
        </svg>
      </Control>
    </Floater>
  );
}
