import { Map } from "immutable";
import React from "react";
import { connect } from "react-redux";
import thumbsDown from "../../assets/thumbs-down.svg";
import thumbsUp from "../../assets/thumbs-up.svg";
import type { RootStateType } from "../../store";
import { applyUpdateUserDetails } from "../../store/auth_actions";
import { Button } from "../button";

interface EditUserDetailsProps {
  userDetails: Map<string, any>;
  applyUpdateUserDetails: (
    messageGood: string,
    messageBad: string,
    commentFeature: boolean,
  ) => void;
}

interface EditUserDetailsState {
  message_good: string;
  message_bad: string;
  comment_feature: boolean;
}

class _EditUserDetails extends React.PureComponent<
  EditUserDetailsProps,
  EditUserDetailsState
> {
  constructor(props: EditUserDetailsProps) {
    super(props);
    this.state = {
      message_good: props.userDetails.get("message_good"),
      message_bad: props.userDetails.get("message_bad"),
      comment_feature: props.userDetails.get("comment_feature"),
    };
  }
  componentWillReceiveProps(nextProps: EditUserDetailsProps) {
    this.setState({ message_good: nextProps.userDetails.get("message_good") });
    this.setState({ message_bad: nextProps.userDetails.get("message_bad") });
    this.setState({
      comment_feature: nextProps.userDetails.get("comment_feature"),
    });
  }
  onChangeMessageGood = (event: any) => {
    this.setState({ message_good: event.target.value });
  };
  onChangeMessageBad = (event: any) => {
    this.setState({ message_bad: event.target.value });
  };
  handleSubmit = (event) => {
    this.props.applyUpdateUserDetails(
      this.state.message_good,
      this.state.message_bad,
      this.state.comment_feature,
    );
  };
  renderGoodBadImg(isGood) {
    return (
      <img
        src={isGood ? thumbsUp : thumbsDown}
        alt={`${isGood ? "good" : "bad"}`}
        className="icon inline-block mt3"
      />
    );
  }

  render() {
    return (
      <div>
        <span className="ml12 flex-parent flex-parent--row my3">
          <p className="flex-child txt-s">
            Default comment for changesets reviewed as GOOD{" "}
            {this.renderGoodBadImg(true)}:
          </p>
        </span>
        <textarea
          placeholder="Define a default message to the changesets you review as good. You can edit it before post a comment."
          className="textarea ml12"
          value={this.state.message_good}
          onChange={this.onChangeMessageGood}
        />
        <span className="ml12 flex-parent flex-parent--row my3 pt6">
          <p className="flex-child txt-s">
            Default comment for changesets reviewed as BAD{" "}
            {this.renderGoodBadImg(false)}:
          </p>
        </span>
        <textarea
          placeholder="Define a default message to the changesets you review as bad. You can edit it before post a comment."
          className="textarea ml12"
          value={this.state.message_bad}
          onChange={this.onChangeMessageBad}
        />
        <Button className="input wmax180 ml12 mt6" onClick={this.handleSubmit}>
          Save Preferences
        </Button>
      </div>
    );
  }
}
const EditUserDetails = connect(
  (state: RootStateType, props) => ({
    userDetails: state.auth.getIn(["userDetails"], Map()),
  }),
  {
    applyUpdateUserDetails,
  },
)(_EditUserDetails);

export { EditUserDetails };
