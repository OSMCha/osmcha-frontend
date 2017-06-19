// @flow
import React from 'react';
import { connect } from 'react-redux';
import Notify from 'react-notification-system';

import type { RootStateType } from '../store';

import {
  dismissModalCallback,
  activateModalCallback
} from '../store/modal_actions';

class Modal extends React.PureComponent {
  props: {
    title: ?string,
    description: ?string,
    kind: 'error' | 'success',
    dismiss: ?boolean,
    autoDismiss: ?boolean,
    dismissModalCallback: number => any,
    activateModalCallback: number => any,
    callbackLabel: ?string,
    error: Object,
    uid: number
  };
  static defaultProps = {
    title: 'Error',
    description: 'Oops there was a problem. Please reload the app.',
    autoDismiss: 5,
    dismiss: true,
    kind: 'error'
  };
  ref = null;
  componentDidMount() {
    if (this.props.error) {
      this.sendNotification(this.props);
    }
  }
  componentWillUpdate(nextProps: Object) {
    this.sendNotification(nextProps);
  }
  sendNotification = nextProps => {
    const uid = nextProps.uid;
    if (!this.ref) return;
    this.ref.addNotification({
      uid,
      title: nextProps.title,
      message:
        (nextProps.error && nextProps.error.message) || nextProps.description,
      level: nextProps.kind,
      autoDismiss: nextProps.autoDismiss,
      dismissible: nextProps.dismiss,
      action: nextProps.callbackLabel && {
        label: nextProps.callbackLabel,
        callback: () => nextProps.activateModalCallback(uid)
      },
      onRemove: () => {
        nextProps.dismissModalCallback(uid);
      }
    });
  };
  addRef = r => {
    this.ref = r;
  };
  render() {
    return <Notify ref={this.addRef} />;
  }
}
Modal = connect(
  (state: RootStateType) => ({
    error: state.modal.get('error'),
    callback: state.modal.get('callback'),
    callbackLabel: state.modal.get('callbackLabel'),
    title: state.modal.get('title'),
    description: state.modal.get('description'),
    dismiss: state.modal.get('dismiss'),
    autoDismiss: state.modal.get('autoDismiss'),
    kind: state.modal.get('kind'),
    uid: state.modal.get('uid')
  }),
  { dismissModalCallback, activateModalCallback }
)(Modal);

export { Modal };
