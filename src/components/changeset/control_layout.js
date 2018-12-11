import React from 'react';

import { Control } from './control';
import { Floater } from './floater';

import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_TAGS,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP
} from '../../config/bindings';

export function ControlLayout({
  bindingsState,
  features,
  discussions,
  toggleDetails,
  toggleFeatures,
  toggleTags,
  toggleDiscussions,
  toggleUser,
  toggleMapOptions
}) {
  return (
    <Floater
      style={{
        marginTop: 8,
        marginLeft: 5
      }}
    >
      <Control
        active={bindingsState.get(CHANGESET_DETAILS_DETAILS.label)}
        onClick={toggleDetails}
        bg={'gray-faint'}
        className="unround-r unround-bl"
      >
        <svg className="icon h18 w18 inline-block align-middle ">
          <use xlinkHref="#icon-eye" />
        </svg>
      </Control>
      <Control
        active={bindingsState.get(CHANGESET_DETAILS_SUSPICIOUS.label)}
        onClick={toggleFeatures}
        bg={'gray-faint'}
        className="unround"
      >
        <svg
          className={`icon h18 w18 inline-block align-middle ${
            features && features.size == 0 ? 'color-darken25' : 'color-black'
          }`}
        >
          <use xlinkHref="#icon-alert" />
        </svg>
      </Control>
      <Control
        active={bindingsState.get(CHANGESET_DETAILS_TAGS.label)}
        onClick={toggleTags}
        bg={'gray-faint'}
        className="unround"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-hash" />
        </svg>
      </Control>
      <Control
        active={bindingsState.get(CHANGESET_DETAILS_DISCUSSIONS.label)}
        onClick={toggleDiscussions}
        bg={'white'}
        className="unround"
      >
        <svg
          className={`icon h18 w18 inline-block align-middle ${
            discussions.size == 0 ? 'color-darken25' : 'color-black'
          }`}
        >
          <use xlinkHref="#icon-contact" />
        </svg>
      </Control>
      <Control
        active={bindingsState.get(CHANGESET_DETAILS_USER.label)}
        onClick={toggleUser}
        bg={'white'}
        className="unround"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-user" />
        </svg>
      </Control>
      <Control
        active={bindingsState.get(CHANGESET_DETAILS_MAP.label)}
        onClick={toggleMapOptions}
        bg={'white'}
        className="unround-r unround-tl"
      >
        <svg className="icon h18 w18 inline-block align-middle">
          <use xlinkHref="#icon-map" />
        </svg>
      </Control>
    </Floater>
  );
}
