// @flow
import React, { Component } from 'react';
import { Map } from 'immutable';

import { isMobile } from './utils';
import { AppMobile } from './AppMobile';
import { AppDesktop } from './AppDesktop';

import { gaPageView } from './utils/analytics';
import { getSearchObj } from './utils/query_params';

export class App extends Component {
  resize = null;
  componentDidMount() {
    if (document && document.body) {
      var filters = getSearchObj(window.location.search).getIn(
        ['filters'],
        Map()
      );
      if (filters && filters.size > 0) {
        filters = filters
          .keySeq()
          .sort((a, b) => a.localeCompare(b))
          .join(',');
        gaPageView({
          page: `/?filters=${filters}`,
          title: 'Filters',
          hitType: 'pageview'
        });
      } else {
        gaPageView({ page: '/', title: 'Home', hitType: 'pageview' });
      }
    }
  }
  render() {
    const mobile = isMobile();
    if (mobile) {
      return <AppMobile />;
    } else {
      return <AppDesktop />;
    }
  }
}
