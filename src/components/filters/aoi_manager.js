// @flow
import React from 'react';
import { List, Map } from 'immutable';
import { Dropdown } from '../dropdown';
import { withFetchDataSilent } from '../fetch_data_enhancer';
import { cancelablePromise } from '../../utils/promise';
import { fetchAllAOIs } from '../../network/aoi';

type propsType = {
  token?: string,
  removeAOI: string => void,
  data?: Map<string, *>,
  loadAoiId: (aoiId: string) => void
};

class AOIManager extends React.PureComponent<void, propsType, *> {
  onChange = changes => {
    if (Array.isArray(changes)) {
      this.props.loadAoiId(changes[0].value);
    }
  };
  onDelete = obj => {};
  render() {
    const data = (this.props.data || Map())
      .getIn(['AOIs', 'features'], List())
      .map(v => {
        return {
          value: v.get('id'),
          label: v.getIn(['properties', 'name'])
        };
      });

    return (
      <Dropdown
        deletable={this.props.removeAOI}
        onAdd={() => {}}
        onRemove={() => {}}
        onChange={this.onChange}
        value={[{ label: 'kusa', value: 'sds' }]}
        options={data.toJS()}
        display="Load"
      />
    );
  }
}
AOIManager = withFetchDataSilent(
  (props: propsType) => ({
    AOIs: cancelablePromise(fetchAllAOIs(props.token))
  }),
  (nextProps: propsType, props: propsType) => true,
  AOIManager
);
export { AOIManager };
