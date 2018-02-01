import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Button } from '../button';
import { applyUpdateUserDetails } from '../../store/auth_actions';
import type { RootStateType } from '../../store';


class EditUserDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message_good: props.userDetails.get('message_good'),
      message_bad: props.userDetails.get('message_bad'),
      comment_feature: props.userDetails.get('comment_feature')
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({message_good: nextProps.userDetails.get('message_good')});
    this.setState({message_bad: nextProps.userDetails.get('message_bad')});
    this.setState({comment_feature: nextProps.userDetails.get('comment_feature')});
  }
  onChangeMessageGood = (event: any) => {
    this.setState({ message_good: event.target.value });
  };
  onChangeMessageBad = (event: any) => {
    this.setState({ message_bad: event.target.value });
  };
  handleSubmit = event => {
    this.props.applyUpdateUserDetails(
      this.state.message_good,
      this.state.message_bad,
      this.state.comment_feature
    );
  }
  render() {
    return(
      <div>
        <span className="ml12 flex-parent flex-parent--row my3">
          <p className="flex-child txt-bold">Default comment for changesets reviewed as GOOD:</p>
        </span>
        <textarea
          placeholder="Define a default message to the changesets you review as good. You can edit it before post a comment."
          className="textarea ml12"
          value={this.state.message_good}
          onChange={this.onChangeMessageGood}
          >
        </textarea>
        <span className="ml12 flex-parent flex-parent--row my3 pt6">
          <p className="flex-child txt-bold">Default comment for changesets reviewed as BAD:</p>
        </span>
        <textarea
          placeholder="Define a default message to the changesets you review as bad. You can edit it before post a comment."
          className="textarea ml12"
          value={this.state.message_bad}
          onChange={this.onChangeMessageBad}
          >
        </textarea>
        <Button className="input wmax180 ml12 mt6" onClick={this.handleSubmit}>
          Save Preferences
        </Button>
      </div>
    );
  }
}
EditUserDetails = connect(
  (state: RootStateType, props) => ({
  userDetails: state.auth.getIn(['userDetails'], Map()),
}),
{
  applyUpdateUserDetails
}
)(EditUserDetails);

export { EditUserDetails };
