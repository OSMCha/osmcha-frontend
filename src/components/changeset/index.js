// @flow
import React from 'react';
import { Map, List, fromJS } from 'immutable';
import CSSGroup from 'react-transition-group/CSSTransitionGroup';
import Mousetrap from 'mousetrap';

import { Navbar } from '../navbar';
import { Floater } from './floater';
import { Header } from './header';
import { Features } from './features';
import { Box } from './box';
import { Discussions } from './discussions';
import { Button } from './button';

// presentational component for view/changeset.js
export class Changeset extends React.PureComponent {
  state = {
    width: 0,
    left: 0,
    discussions: false,
    features: false,
    details: true,
    showAll: true,
    discussionsData: List(),
    userDetails: new Map()
  };
  props: {
    changesetId: number,
    currentChangeset: Map<string, *>
  };
  getData = (changesetId: number, currentChangeset: Map<string, *>) => {
    const uid: string = currentChangeset.getIn(['properties', 'uid']);
    const user = {};
    fetch(
      `
      https://api.openstreetmap.org/api/0.6/user/${uid}`
    )
      .then(r => r.text())
      .then(r => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(r, 'text/xml');
        xml.getElementsByTagName('osm');
        const userXml =
          xml.getElementsByTagName('osm')[0] &&
          xml.getElementsByTagName('osm')[0].getElementsByTagName('user')[0];

        user.count =
          userXml.getElementsByTagName('changesets')[0] &&
          userXml.getElementsByTagName('changesets')[0].getAttribute('count');

        user.uid = userXml.getAttribute('id');

        user.accountCreated = userXml.getAttribute('account_created');

        user.description =
          userXml.getElementsByTagName('description')[0] &&
          userXml.getElementsByTagName('description')[0].innerHTML;

        user.img =
          userXml.getElementsByTagName('img')[0] &&
          userXml.getElementsByTagName('img')[0].getAttribute('href');

        return user;
      })
      .catch(e => {
        console.error(e);
        return user;
      })
      .then(user => {
        this.setState({
          userDetails: fromJS(user)
        });
      });
    fetch(
      `https://osm-comments-api.mapbox.com/api/v1/changesets/${changesetId}`
    )
      .then(r => r.json())
      .then(x => {
        if (x && x.properties && Array.isArray(x.properties.comments)) {
          this.setState({
            discussionsData: fromJS(x.properties.comments)
          });
        }
      });
  };
  componentWillReceiveProps(nextProps: Object) {
    if (this.props.changesetId !== nextProps.changesetId)
      this.getData(nextProps.changesetId, nextProps.currentChangeset);
  }
  componentDidMount() {
    Mousetrap.bind('ctrl+a', () => {
      this.toggleAll();
    });
    Mousetrap.bind('ctrl+s', () => {
      this.toggleFeatures();
    });
    Mousetrap.bind('ctrl+d', () => {
      this.toggleDiscussions();
    });
    Mousetrap.bind('ctrl+o', () => {
      this.toggleDetails();
    });
    this.getData(this.props.changesetId, this.props.currentChangeset);
  }
  setRef = (r: any) => {
    if (!r) return;
    var rect = r.parentNode.parentNode.parentNode.getBoundingClientRect();
    this.setState({
      width: parseInt(rect.width, 10),
      left: parseInt(rect.left, 10)
    });
  };

  ref = null;

  showFloaters = () => {
    const { changesetId, currentChangeset } = this.props;
    const properties = currentChangeset.get('properties');

    return (
      <CSSGroup
        name="floaters"
        transitionName="floaters"
        transitionAppearTimeout={300}
        transitionAppear={true}
        transitionEnterTimeout={400}
        transitionLeaveTimeout={250}
      >
        {this.state.details &&
          <Box key={3} className=" w420 round-tr round-br">
            <Header
              changesetId={changesetId}
              properties={properties}
              userEditCount={this.state.userDetails.get('count')}
            />
          </Box>}
        {this.state.features &&
          <Box key={2} className=" w420 round-tr round-br">
            <Features changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.discussions &&
          <Box key={1} className=" w420  round-tr round-br">
            <Discussions
              changesetId={changesetId}
              discussions={this.state.discussionsData}
            />
          </Box>}
      </CSSGroup>
    );
  };

  toggleAll = () => {
    this.setState({
      features: this.state.showAll,
      discussions: this.state.showAll,
      details: this.state.showAll,
      showAll: !this.state.showAll
    });
  };
  toggleFeatures = () => {
    this.setState({
      discussions: false,
      details: false,
      showAll: false,
      features: !this.state.features
    });
  };
  toggleDiscussions = () => {
    this.setState({
      discussions: !this.state.discussions,
      details: false,
      showAll: false,
      features: false
    });
  };
  toggleDetails = () => {
    this.setState({
      discussions: false,
      details: !this.state.details,
      showAll: false,
      features: false
    });
  };
  render() {
    return (
      <div className="flex-child clip" ref={this.setRef}>
        <Floater
          style={{
            top: 55 * 1.1,
            width: 80,
            left: this.state.left - 15
          }}
        >
          <Button
            active={this.state.details}
            onClick={this.toggleDetails}
            bg={'gray-faint'}
            className="unround-r unround-bl"
          >
            <svg className="icon inline-block align-middle ">
              <use xlinkHref="#icon-eye" />
            </svg>
          </Button>
          <Button
            active={this.state.features}
            onClick={this.toggleFeatures}
            bg={'gray-faint'}
            className="unround"
          >
            <svg
              className={`icon inline-block align-middle ${this.props.currentChangeset.getIn(
                ['properties', 'features']
              ).size > 0 ? 'color-orange' : ''}`}
            >
              <use xlinkHref="#icon-bug" />
            </svg>
          </Button>
          <Button
            active={this.state.discussions}
            onClick={this.toggleDiscussions}
            bg={'white'}
            className="unround"
          >
            <svg
              className={`icon inline-block align-middle ${this.state.discussionsData.size > 0 ? 'color-orange' : ''}`}
            >
              <use xlinkHref="#icon-tooltip" />
            </svg>
          </Button>
          <Button
            active={!this.state.showAll}
            onClick={this.toggleAll}
            bg={'white'}
            className="unround-r unround-tl"
          >
            {this.state.showAll
              ? <svg className="icon inline-block align-middle">
                  <use xlinkHref="#icon-database" />
                </svg>
              : <svg className="icon inline-block align-middle">
                  <use xlinkHref="#icon-database" />
                </svg>}
          </Button>
        </Floater>
        <Floater
          style={{
            top: 55 * 1.1,
            width: 420,
            left: 40 + this.state.left
          }}
        >
          {this.showFloaters()}
        </Floater>
      </div>
    );
  }
}
