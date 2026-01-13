import React from 'react';
import { Map, List } from 'immutable';

import { cancelablePromise } from '../../utils/promise';
import { postComment } from '../../network/changeset';
import { Button } from '../button';

type propsType = {
  token: string;
  changesetId: number;
  userDetails: Map<string, any>;
  changesetIsHarmful: boolean;
  discussions: List<any>;
};

type stateType = {
  success: boolean;
  error: boolean;
  value: string;
};

export class CommentForm extends React.PureComponent<propsType, stateType> {
  postCommentPromise: any;
  clicked: boolean = false;

  state: stateType = {
    success: false,
    error: false,
    value: '',
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
    const userCommentedBefore =
      props.discussions.filter(
        (item) => item.get('userName') === props.userDetails.get('username')
      ).size > 0;
    if (
      this.state.value === '' &&
      props.changesetIsHarmful !== null &&
      !userCommentedBefore
    ) {
      if (props.changesetIsHarmful) {
        this.setState({ value: props.userDetails.get('message_bad') });
      } else {
        this.setState({ value: props.userDetails.get('message_good') });
      }
    }
  }
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
    if (this.state.error) {
      this.setState({ error: false });
    }
    if (this.state.success) {
      this.setState({ success: false });
    }
  };
  postComment = (comment: string) => {
    if (!comment) return;
    this.postCommentPromise = cancelablePromise(
      postComment(this.props.changesetId, this.props.token, comment)
    );
    this.postCommentPromise.promise
      .then((r) => {
        this.setState({ success: true });
        this.setState({ error: false });
        this.setState({ value: '' });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ error: true });
        this.setState({ success: false });
      });
  };
  handleSubmit = (event) => {
    this.postComment(this.state.value);
  };
  render() {
    return (
      <div>
        {this.props.token && (
          <div className="flex-parent flex-parent--column mt6 mb3">
            {this.state.success && (
              <div className="bg-green-faint color-green inline-block px6 py3 txt-s align-center round my12">
                <strong>Comment successfully posted.</strong>
                <br />
                <span>It will appear on OSMCha after some minutes.</span>
              </div>
            )}
            {this.state.error && (
              <div className="bg-red-faint color-red-dark inline-block px6 py3 txt-s align-center round my12">
                <strong>It was not possible to post your comment.</strong>
              </div>
            )}
            <div className="grid grid--gut12">
              <div className="col col--12">
                <textarea
                  placeholder="Provide constructive feedback to the mapper with a changeset comment."
                  className="textarea"
                  ref={(r) => {
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
        )}
      </div>
    );
  }
}
