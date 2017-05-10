import React from 'react';
import debounce from 'lodash.debounce';
let changesetId;
let adiffResult;
let width = 700;
let height = 500;

function loadMap() {
  const changesetMap = window.renderChangesetMap;
  var container = document.getElementById('container');
  console.log(height);
  try {
    changesetMap(
      container,
      changesetId,
      {width: width + 'px', height: Math.max(500, height) + 'px'},
      adiffResult,
    );
  } catch (e) {
    console.log(e);
  }
}

var deb = debounce(loadMap, 700);

export class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    adiffResult: Object,
  };
  state = {
    visible: false,
  };
  componentDidMount() {
    changesetId = this.props.changesetId;
    adiffResult = this.props.adiffResult;
    if (this.ref) {
      var rect = this.ref.parentNode.parentNode.parentNode.getBoundingClientRect();
      height = parseInt(window.innerHeight * 0.5, 10);
      width = parseInt(rect.width, 10);
    }
    setTimeout(
      () => {
        this.setState({
          visible: true,
        });
      },
      1000,
    );
    deb();
  }
  setRef = r => this.ref = r;
  render() {
    return (
      <div className="flex-parent justify--center">
        <div
          style={{
            height: parseInt(window.innerHeight * 0.5, 10),
            display: this.state.visible ? 'none' : 'block',
          }}
        />
        <div
          id="container"
          className="border border--2 border--gray-dark"
          style={{visibility: this.state.visible ? 'visible' : 'hidden'}}
          ref={this.setRef}
        />
      </div>
    );
  }
}
