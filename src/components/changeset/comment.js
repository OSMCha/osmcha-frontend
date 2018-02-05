// @flow
import React from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';

import { cancelablePromise } from '../../utils/promise';
import { postComment } from '../../network/changeset';
import { Button } from '../button';

type propsType = {
  token: string,
  changesetId: number,
  userDetails: Map<string, any>,
  changesetIsHarmful: boolean
};

class CommentForm extends React.PureComponent<any, propsType, any> {
  postCommentPromise;

  state = {
    success: false,
    error: false,
    value: ''
  };

  componentWillUnmount() {
    this.postCommentPromise && this.postCommentPromise.cancel();
  }
  componentDidMount() {
    this.updateValue(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateValue(nextProps);
  }
  updateValue(props) {
    if (this.state.value === '' && props.changesetIsHarmful !== null) {
      if (props.changesetIsHarmful) {
        this.setState({ value: props.userDetails.get('message_bad') });
      } else {
        this.setState({ value: props.userDetails.get('message_good') });
      }
    }
  }
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
  };
  postComment = (comment: string) => {
    if (!comment) return;
    this.postCommentPromise = cancelablePromise(
      postComment(this.props.changesetId, this.props.token, comment)
    );
    this.postCommentPromise.promise
      .then(r => {
        this.setState({ success: true });
        this.setState({ value: '' });
      })
      .catch(e => {
        console.log(e);
        this.setState({ error: true });
      });
  };
  handleSubmit = event => {
    this.postComment(this.state.value);
  };
  render() {
    return (
      <div className="flex-parent flex-parent--column mt6 mb3">
        {this.state.success &&
          <div className="bg-green-faint color-green inline-block px6 py3 txt-xs txt-bold round-full my12">
            <span>Comment successfully posted.</span>
          </div>}
        {this.state.error &&
          <div className="bg-orange-faint color-orange-dark inline-block px6 py3 txt-xs txt-bold round-full my12">
            <span>Some error ocurred.</span>
          </div>}
        <div className="grid grid--gut12">
          <div className="col col--12">
            <textarea
              placeholder="Communicate with the mapper sending him a changeset comment."
              className="textarea"
              ref={r => {
                if (this.clicked) {
                  r && r.select();
                  this.clicked = false;
                }
              }}
              value={this.state.value}
              onChange={this.onChange}
            />
            <div className="pt6 fr">
              <Button className="input wmax120" onClick={this.handleSubmit}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm = connect((state: RootStateType, props) => ({
  token: state.auth.get('token'),
  userDetails: state.auth.getIn(['userDetails'], Map())
}))(CommentForm);

export { CommentForm };
