import React from 'react';
import debounce from 'lodash.debounce';
let changesetId;
let adiffResult;

function loadMap() {
  const changesetMap = window.renderChangesetMap;
  var container = document.getElementById('container');
  changesetMap(
    container,
    changesetId,
    {width: '800px', height: '500px'},
    adiffResult,
  );
}
var deb = debounce(loadMap, 700);

export class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    adiffResult: Object,
  };
  componentDidMount() {
    changesetId = this.props.changesetId;
    adiffResult = this.props.adiffResult;
    deb();
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
