import React from 'react';
export class CMap extends React.PureComponent {
  props: {
    changesetId: number,
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    require.ensure([], require => {
      require('changeset-map');
      const changesetMap = window.render;
      console.log(changesetMap);
      var container = document.getElementById('container');
      var changesetMapControl = changesetMap(
        container,
        this.props.changesetId,
        {width: '800px', height: '500px'},
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
