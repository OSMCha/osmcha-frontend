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
    dismissModalCallback: () => any,
    activateModalCallback: () => any,
    callbackLabel: ?string,
    uid: number
  };
  static defaultProps = {
    autoDismiss: 5
  };
  ref = null;
  componentWillUpdate(nextProps: Object) {
    console.log(nextProps.uid);
    if (this.ref) {
      const uid = nextProps.uid;
      this.ref.addNotification({
        uid,
        title: nextProps.title,
        message: nextProps.description,
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
    }
  }
  addRef = r => {
    this.ref = r;
  };
  render() {
    return <Notify ref={this.addRef} />;
  }
}
Modal = connect(
  (state: RootStateType, props) => ({
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
