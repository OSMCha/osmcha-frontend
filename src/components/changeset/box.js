import React from 'react';
import {Tooltip} from 'react-tippy';
import {CSSTransitionGroup} from 'react-transition-group';
class BoxMin extends React.PureComponent {
  render() {
    return (
      <div
        className="my12 border border--gray-light z4 transition"
        style={{visibility: this.props.showMore ? 'hidden' : 'visible'}}
      >
        <div className="px24 pt12">
          {this.props.children}
        </div>
        <div
          className="flex-parent color-gray flex-parent--row  flex-parent--center-main"
        >
          <div
            className="flex-child cursor-pointer"
            onClick={this.props.toggleShowMore}
          >
            <span>show more</span>
            <svg className="icon  ml30">
              <use xlinkHref="#icon-chevron-down" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

class BoxMax extends React.PureComponent {
  render() {
    const {top, left, right, width} = this.props.dimensions;
    console.log(top, left, right);
    return (
      <div
        className="border border--gray-light z4 absolute bg-white transition"
        style={{top, left, right, width}}
      >
        <div className="px24 pt12">
          {this.props.children}
          {this.props.children}
        </div>
        <div
          className="flex-parent color-gray flex-parent--row  flex-parent--center-main"
        >
          <div
            className="flex-child cursor-pointer"
            onClick={this.props.toggleShowMore}
          >
            <span>show less</span>
            <svg className="icon  ml30">
              <use xlinkHref="#icon-chevron-up" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export class Box extends React.PureComponent {
  state = {
    showMore: false,
  };
  toggleShowMore = () => {
    this.setState({
      showMore: !this.state.showMore,
    });
  };
  calculateSize() {
    if (!this.ref) return;
    this.dimensions = this.ref.getBoundingClientRect();
  }
  componentDidMount() {
    this.calculateSize();
  }
  render() {
    console.log('render');
    return (
      <div ref={r => this.ref = r}>
        <CSSTransitionGroup
          transitionName="showmore"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={200}
        >
          <BoxMin
            key={1}
            showMore={this.state.showMore}
            toggleShowMore={this.toggleShowMore}
          >
            {this.props.children}
          </BoxMin>
          {this.state.showMore &&
            <BoxMax
              key={0}
              showMore={this.state.showMore}
              toggleShowMore={this.toggleShowMore}
              dimensions={this.dimensions}
            >
              {this.props.children}
            </BoxMax>}
        </CSSTransitionGroup>
      </div>
    );
  }
}
