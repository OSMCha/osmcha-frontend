import React from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Loading } from '../components/loading';
import { dispatchEvent } from '../utils/dispatch_event';
import 'changeset-map/public/css/style.css';
import type { RootStateType } from '../store';

let changesetId;
let currentChangesetMap;
let width = 700;
let height = 500;
let event;
let cMapRender;

let getMapInstance;
export function selectFeature(id: number) {
  if (!id || !event) return;
  event.emit('selectFeature', 'node|way', id);
}

function importChangesetMap() {
  if (cMapRender) return Promise.resolve(cMapRender);
  return import('changeset-map')
    .then(function(module) {
      cMapRender = module.render;
      getMapInstance = module.getMapInstance;
      return cMapRender;
    })
    .catch(function(err) {
      console.error(err);
      console.log('Failed to load module changeset-map');
    });
}

function loadMap() {
  var container = document.getElementById('container');
  if (!container || !currentChangesetMap) return;
  importChangesetMap().then(render => {
    if (!render) return;
    // if (event) event.emit('clearFeature');
    event = render(container, changesetId, {
      width: width + 'px',
      height: Math.max(400, height) + 'px',
      data: currentChangesetMap,
      disableSidebar: true
    });
  });
}

var minDebounce = debounce(loadMap, 250);

class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    currentChangesetMap: Object,
    errorChangesetMap: ?Object,
    loadingChangesetMap: boolean,
    className: string
  };
  state = {
    visible: false,
    height: 0,
    width: 0
  };
  ref = null;
  componentDidMount() {
    changesetId = this.props.changesetId;
    currentChangesetMap = this.props.currentChangesetMap;
    if (this.ref) {
      var rect = this.ref.parentNode.getBoundingClientRect();
      height = parseInt(window.innerHeight - 1 * 55, 10);
      width = parseInt(rect.width, 10);
    }
    window.onresize = debounce(this.setDimensions, 100);
    minDebounce();
  }
  componentWillUnmount() {
    window.onresize = null;
    event && event.emit('remove');
  }
  componentDidUpdate(prevProp: Object) {
    if (this.props.currentChangesetMap !== prevProp.currentChangesetMap) {
      minDebounce();
    }
  }
  setRef = (r: any) => {
    this.ref = r;
    this.setDimensions();
  };
  setDimensions = () => {
    if (!this.ref) return;
    var rect = this.ref.parentNode.getBoundingClientRect();
    height = parseInt(window.innerHeight - 1 * 55, 10);
    width = parseInt(rect.width, 10);
    this.setState({
      height,
      width
    });
    if (getMapInstance) {
      getMapInstance().map.resize();
    }
  };
  render() {
    if (this.props.errorChangesetMap) {
      dispatchEvent('showToast', {
        title: 'changeset-map failed to load',
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error'
      });
      console.error(this.props.errorChangesetMap);
      // return null;
    }
    changesetId = this.props.changesetId;
    currentChangesetMap = this.props.currentChangesetMap;
    return (
      <div className="wmin480 fixed bottom right bg-black" ref={this.setRef}>
        <div
          id="container"
          className=""
          style={{
            height: this.state.height,
            width: this.state.width,
            visibility: !(
              this.props.loadingChangesetMap || this.props.errorChangesetMap
            )
              ? 'visible'
              : 'hidden'
          }}
        />
        <CSSTransitionGroup
          transitionName="map-hide"
          transitionAppearTimeout={300}
          transitionAppear={true}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={1000} // determines the transition to cMap
        >
          {(this.props.loadingChangesetMap || this.props.errorChangesetMap) &&
            <div
              key={0}
              id="placeholder"
              className={` fixed bottom right z0
          ${this.props.errorChangesetMap ? 'bg-red' : 'bg-black'}
          `}
              style={{
                height: this.state.height,
                width: this.state.width
              }}
            >
              <Loading height={this.state.height} />
            </div>}
        </CSSTransitionGroup>
      </div>
    );
  }
}

CMap = connect((state: RootStateType, props) => ({
  changesetId: state.changeset.get('changesetId'),
  currentChangesetMap: state.changeset.getIn([
    'changesetMap',
    state.changeset.get('changesetId')
  ]),
  errorChangesetMap: state.changeset.get('errorChangesetMap'),
  loadingChangesetMap: state.changeset.get('loadingChangesetMap')
}))(CMap);

export { CMap };
