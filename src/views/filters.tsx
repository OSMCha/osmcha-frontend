import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Map, List, fromJS, is } from 'immutable';

import { checkForNewChangesets } from '../store/changesets_page_actions';
import { applyFilters } from '../store/filters_actions';
import { applyUpdateAOI, applyCreateAOI } from '../store/aoi_actions';
import { modal } from '../store/modal_actions';

import { FiltersList } from '../components/filters/filters_list';
import { FiltersHeader } from '../components/filters/filters_header';

import { deleteAOI } from '../network/aoi';
import type { RootStateType } from '../store';
import { delayPromise, isMobile } from '../utils';

import type { filterType, filtersType } from '../components/filters';
const NEW_AOI = 'unnamed *';

type propsType = {
  filters: filtersType;
  loading: boolean;
  aoi: any;
  token: string;
  location: any;
  features: List<Map<string, any>> | undefined | null;
  checkForNewChangesets: (a: boolean) => any;
  push: (location: any) => void;
  applyFilters: (a: filtersType, path?: string) => unknown; // base 0;
  applyCreateAOI: (name: string, a: filtersType) => unknown;
  applyUpdateAOI: (aoiId: string, name: string, a: filtersType) => unknown;
  modal: (a: any) => any;
};

type stateType = {
  filters: filtersType;
  active: string;
};

const noDateGte: filtersType = fromJS({
  date__gte: [{ label: '', value: '' }],
});

class _Filters extends React.PureComponent<propsType, stateType> {
  state = {
    filters: this.props.filters,
    active: '',
    // aoiName: this.props.aoi.getIn(['properties', 'name'], NEW_AOI)
  };
  componentWillReceiveProps(nextProps: propsType) {
    if (!is(this.props.filters, nextProps.filters)) {
      this.setState({
        filters: nextProps.filters,
      });
    }
  }
  handleFocus = (name: string) => {
    this.setState({
      active: name,
    });
  };
  handleApply = () => {
    // in case the user clicks on apply when filter
    // loaded AOI.
    if (JSON.stringify(this.state.filters.toJS()).length > 7000) {
      this.props.modal({
        kind: 'error',
        title: 'Use Save Filter',
        description:
          'Your filter is too big to be applied. You need to Save your Filter to be able to see the results.',
      });
    } else {
      if (is(this.state.filters, this.props.filters)) {
        this.props.push({
          ...this.props.location,
          pathname: '/',
        });
        return;
      }
      this.props.applyFilters(this.state.filters, '/');
      // show user if there were any new changesets
      // incase service had cached the request
      delayPromise(3000).promise.then(() =>
        this.props.checkForNewChangesets(true)
      );
    }
  };
  handleChange = (name: string, values?: filterType) => {
    this.setState((state) => {
      let filters = state.filters;
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
      return { filters };
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
  replaceFiltersState = (filters) => {
    this.setState({ filters });
  };
  handleClear = () => {
    this.props.applyFilters(Map(), '/');
  };
  loadAoiId = (aoiId: string) => {
    this.props.push({
      ...this.props.location,
      search: `aoi=${aoiId}`,
    });
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
    deleteAOI(this.props.token, aoiId).catch((e) => console.error(e));
  };
  createAOI = (name: string) => {
    this.props.applyCreateAOI(name, this.state.filters);
  };
  updateAOI = (aoiId: string, name: string) => {
    this.props.applyUpdateAOI(aoiId, name, this.state.filters);
  };
  render() {
    const mobile = isMobile();

    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white ${
          mobile ? 'viewport-full' : ''
        }`}
      >
        <FiltersHeader
          createAOI={this.createAOI}
          updateAOI={this.updateAOI}
          removeAOI={this.removeAOI}
          loading={this.props.loading}
          token={this.props.token}
          aoiName={this.getAOIName()}
          aoiId={this.props.loading ? '' : this.props.aoi.get('id')}
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

const Filters = connect(
  (state: RootStateType, props) => ({
    filters: state.filters.get('filters'),
    aoi: state.aoi.get('aoi'),
    loading: state.filters.get('loading'),
    features: state.changesetsPage.getIn(['currentPage', 'features']),
    location: props.location,
    token: state.auth.get('token'),
  }),
  {
    checkForNewChangesets,
    applyFilters,
    applyCreateAOI,
    applyUpdateAOI,
    push,
    modal,
  }
)(_Filters);

export { Filters };
