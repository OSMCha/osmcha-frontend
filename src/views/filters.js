// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';

import {
  applyFilters,
  checkForNewChangesets
} from '../store/changesets_page_actions';

import { FiltersList } from '../components/filters/filters_list';
import { FiltersHeader } from '../components/filters/filters_header';

import type { RootStateType } from '../store';
import { delayPromise } from '../utils/promise';
import { gaSendEvent } from '../utils/analytics';

import type { filterType, filtersType } from '../components/filters';

type propsType = {
  filters: filtersType,
  location: Object,
  features: ?List<Map<string, any>>,
  checkForNewChangesets: boolean => any,
  applyFilters: (Object, string) => mixed
};

type stateType = {
  filters: filtersType,
  active: string
};
const noDateGte: filterType = fromJS({
  date__gte: [{ label: '', value: null }]
});

class Filters extends React.PureComponent<void, propsType, stateType> {
  state = {
    filters: this.props.filters,
    active: ''
  };
  handleFocus = (name: string) => {
    this.setState({
      active: name
    });
  };
  handleApply = () => {
    this.props.applyFilters(this.state.filters, '/');
    this.sendToAnalytics();
    // show user if there were any new changesets
    // incase service had cached the request
    delayPromise(3000).promise.then(() =>
      this.props.checkForNewChangesets(true)
    );
  };
  sendToAnalytics = () => {
    const filters = this.state.filters;
    filters.forEach((v, k) => {
      v.forEach(vv => {
        gaSendEvent({
          category: 'Filters',
          action: k,
          label: vv.get('label')
        });
      });
    });
  };
  handleChange = (name: string, values?: filterType) => {
    let filters = this.state.filters;
    // if someone cleared date__gte filter
    // we use the convention defined at `noDateGte`
    // to signify no default gte.
    if (name === 'date__gte' && values == null) {
      filters = filters.merge(noDateGte);
    } else if (values == null) {
      // clear this filter
      filters = filters.delete(name);
    } else {
      filters = filters.set(name, values);
    }
    return this.setState({
      filters
    });
  };
  handleToggleAll = (name: string, values?: filterType) => {
    let filters = this.state.filters;
    const isAll = name.slice(0, 4) === 'all_';
    //  delete the opposite value
    if (isAll) {
      filters = filters.delete(name.slice(4));
    } else {
      filters = filters.delete('all_' + name);
    }
    // regularly handle change
    if (!values) {
      filters = filters.delete(name);
    } else {
      filters = filters.set(name, values);
    }
    return this.setState({ filters });
  };
  replaceFiltersState = filters => {
    this.setState({ filters });
  };
  handleClear = () => {
    this.props.applyFilters(new Map(), '/');
  };
  render() {
    const width = window.innerWidth;

    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white ${width <
        800
          ? 'viewport-full'
          : ''}`}
      >
        <FiltersHeader
          handleApply={this.handleApply}
          handleClear={this.handleClear}
          search={this.props.location.search}
        />
        <FiltersList
          filters={this.state.filters}
          active={this.state.active}
          handleFocus={this.handleFocus}
          handleChange={this.handleChange}
          handleToggleAll={this.handleToggleAll}
          replaceFiltersState={this.replaceFiltersState}
        />
      </div>
    );
  }
}

Filters = connect(
  (state: RootStateType, props) => ({
    filters: state.changesetsPage.get('filters'),
    features: state.changesetsPage.getIn(['currentPage', 'features']),
    location: props.location
  }),
  {
    applyFilters,
    checkForNewChangesets
  }
)(Filters);

export { Filters };
