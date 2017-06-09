import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, ToastMessage } from 'react-toastr';
var ToastMessageFactory = React.createFactory(ToastMessage.animation);

class Modal extends React.PureComponent {
  componentWillUpdate() {
    this.refs.toastr.success(
      'Welcome welcome welcome!!',
      'You are now home my friend. Welcome home my friend.',
      {
        timeOut: 30000,
        extendedTimeOut: 10000
      }
    );
  }
  render() {
    return (
      <ToastContainer
        ref="toastr"
        toastMessageFactory={ToastMessageFactory}
        className="toast-top-right"
      />
    );
  }
}
Modal = connect((state: RootStateType, props) => ({
  error: state.modal.get('error'),
  callback: state.modal.get('callback'),
  kind: state.modal.get('kind')
}))(Modal);

export { Modal };
