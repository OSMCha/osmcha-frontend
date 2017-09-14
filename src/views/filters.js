// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Map, List, fromJS, is } from 'immutable';

import { checkForNewChangesets } from '../store/changesets_page_actions';
import { applyFilters } from '../store/filters_actions';

import { FiltersList } from '../components/filters/filters_list';
import { FiltersHeader } from '../components/filters/filters_header';

import { createAOI, deleteAOI, updateAOI } from '../network/aoi';
import type { RootStateType } from '../store';
import { delayPromise, cancelablePromise } from '../utils/promise';
import { gaSendEvent } from '../utils/analytics';

import type { filterType, filtersType } from '../components/filters';
const NEW_AOI = 'unnamed *';

type propsType = {|
  filters: filtersType,
  loading: boolean,
  aoi: Map<string, *>,
  token: string,
  location: Object,
  features: ?List<Map<string, any>>,
  checkForNewChangesets: boolean => any,
  push: (location: Object) => void,
  applyFilters: (filtersType, path?: string) => mixed // base 0
|};

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
    // aoiName: this.props.aoi.getIn(['properties', 'name'], NEW_AOI)
  };
  createAOIPromise;
  updateAOIPromise;
  componentWillReceiveProps(nextProps: propsType) {
    if (!is(this.props.filters, nextProps.filters)) {
      this.setState({
        filters: nextProps.filters
      });
    }
  }
  componentWillUnmount() {
    this.createAOIPromise && this.createAOIPromise.cancel();
    this.updateAOIPromise && this.updateAOIPromise.cancel();
  }
  handleFocus = (name: string) => {
    this.setState({
      active: name
    });
  };
  handleApply = () => {
    // in case the user clicks on apply when filter
    // loaded AOI.
    if (is(this.state.filters, this.props.filters)) {
      this.props.push({
        ...this.props.location,
        pathname: '/'
      });
      return;
    }
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
  loadAoiId = (aoiId: string) => {
    this.props.push({
      ...this.props.location,
      search: `aoi=${aoiId}`
    });
  };
  createAOI = (name: string) => {
    this.createAOIPromise = cancelablePromise(
      createAOI(this.props.token, name, this.state.filters)
    );
    this.createAOIPromise.promise
      .then(r => r && this.loadAoiId(r.id))
      .catch(e => console.error(e));
  };
  getAOIName = () => {
    if (this.props.loading) return '';
    return this.props.aoi.getIn(['properties', 'name'], NEW_AOI);
  };
  getAOIId = (aoiId: string) => {
    if (this.props.loading) return '';
    return this.props.aoi.get('id');
  };
  removeAOI = (aoiId: string) => {
    if (aoiId === this.props.aoi.get('id')) {
      this.handleClear();
    }
    deleteAOI(this.props.token, aoiId)
      .then(r => console.log(r))
      .catch(e => console.error(e));
  };
  updateAOI = (aoiId: string, name: string) => {
    this.updateAOIPromise = cancelablePromise(
      updateAOI(this.props.token, aoiId, name, this.state.filters)
    );
    this.updateAOIPromise.promise
      .then(r => r && this.loadAoiId(r.id))
      .catch(e => console.error(e));
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
          createAOI={this.createAOI}
          updateAOI={this.updateAOI}
          removeAOI={this.removeAOI}
          loading={this.props.loading}
          token={this.props.token}
          aoiName={this.getAOIName()}
          aoiId={this.getAOIId()}
          loadAoiId={this.loadAoiId}
          handleApply={this.handleApply}
          handleClear={this.handleClear}
          search={this.props.location.search}
        />
        <FiltersList
          loading={this.props.loading}
          filters={this.state.filters}
          active={this.state.active}
          handleFocus={this.handleFocus}
          handleChange={this.handleChange}
          handleToggleAll={this.handleToggleAll}
          replaceFiltersState={this.replaceFiltersState}
          token={this.props.token}
        />
      </div>
    );
  }
}

Filters = connect(
  (state: RootStateType, props) => ({
    filters: state.filters.get('filters'),
    aoi: state.filters.get('aoi'),
    loading: state.filters.get('loading'),
    features: state.changesetsPage.getIn(['currentPage', 'features']),
    location: props.location,
    token: state.auth.get('token')
  }),
  {
    checkForNewChangesets,
    applyFilters,
    push
  }
)(Filters);

export { Filters };
