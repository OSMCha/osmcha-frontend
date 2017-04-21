import React from 'react';
import {dispatchEvent} from '../utils/dispatch_event';
export class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    adiffResult: Object,
  };
  componentDidMount() {
    require.ensure([], require => {
      const changesetMap = window.renderChangesetMap;
      dispatchEvent('showToast', {
        title: 'map loaded',
        content: 'hello',
        timeOut: 2000,
        type: 'info',
      });
      var container = document.getElementById('container');
      var changesetMapControl = changesetMap(
        container,
        this.props.changesetId,
        {width: '800px', height: '500px'},
        this.props.adiffResult,
      );
    });
  }
  render() {
    return (
      <div>
        here lies the Cmap {this.props.changesetId}
        <div id="container" />
      </div>
    );
  }
}
