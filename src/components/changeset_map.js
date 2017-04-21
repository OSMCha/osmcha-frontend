import React from 'react';
export class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    adiffResult: Object,
  };
  componentDidMount() {
    require.ensure([], require => {
      const changesetMap = window.renderChangesetMap;
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
