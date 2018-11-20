// @flow
import React from 'react';

import { SignInButton } from './changeset/sign_in_button';

export function SignIn() {
  return (
    <div className="flex-parent flex-parent--column flex-parent--center-cross bg-gray-faint hfull-55">
      <div className="flex-child flex-child--grow">&nbsp;</div>
      <div className="flex-parent flex-parent--column flex-parent--center-cross">
        <svg className="icon h160 w160 inline-block align-middle pb3">
          <use xlinkHref="#icon-osm" />
        </svg>
      </div>
      <div className="flex-parent flex-parent--column align-center txt-l txt-bold pt12">
        Sign in with your OpenStreetMap account to use OSMCha.
      </div>
      <div className="flex-parent flex-parent--column align-center txt-l pt36">
        <SignInButton
          className="border--darken5 border--darken25-on-hover bg-gray-light color-gray-dark"
          text="Sign in"
        />
      </div>
      <div className="flex-child flex-child--grow">&nbsp;</div>
    </div>
  );
}
