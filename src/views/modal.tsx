import React from "react";
import Notify from "react-notification-system";
import { connect } from "react-redux";

import type { RootStateType } from "../store";

import {
  activateModalCallback,
  dismissModalCallback,
} from "../store/modal_actions";

interface ModalProps {
  title: string | undefined | null;
  description: string | undefined | null;
  kind: "error" | "success";
  dismiss: boolean | undefined | null;
  autoDismiss: boolean | undefined | null;
  dismissModalCallback: (a: number) => any;
  activateModalCallback: (a: number) => any;
  position: string | undefined | null;
  callbackLabel: string | undefined | null;
  error: any;
  uid: number;
}

class _Modal extends React.PureComponent<ModalProps> {
  ref: any = null;
  componentDidMount() {
    if (this.props.error) {
      this.sendNotification(this.props);
    }
  }
  componentWillUpdate(nextProps: any) {
    this.sendNotification(nextProps);
  }
  sendNotification = (nextProps) => {
    const uid = nextProps.uid;
    if (!this.ref) return;
    this.ref.addNotification({
      uid,
      title: nextProps.title ?? "Error",
      message:
        (nextProps.error && nextProps.error.message) ||
        nextProps.description ||
        "Oops there was a problem. Please reload the app.",
      level: nextProps.kind ?? "error",
      autoDismiss: nextProps.autoDismiss ?? 5,
      position: nextProps.position ?? "tr",
      dismissible: nextProps.dismiss ?? true,
      action: nextProps.callbackLabel && {
        label: nextProps.callbackLabel,
        callback: () => nextProps.activateModalCallback(uid),
      },
      onRemove: () => {
        nextProps.dismissModalCallback(uid);
      },
    });
  };
  addRef = (r) => {
    this.ref = r;
  };
  render() {
    return <Notify ref={this.addRef} />;
  }
}
const Modal = connect(
  (state: RootStateType) => ({
    error: state.modal.get("error"),
    callback: state.modal.get("callback"),
    callbackLabel: state.modal.get("callbackLabel"),
    title: state.modal.get("title"),
    description: state.modal.get("description"),
    dismiss: state.modal.get("dismiss"),
    position: state.modal.get("position"),
    autoDismiss: state.modal.get("autoDismiss"),
    kind: state.modal.get("kind"),
    uid: state.modal.get("uid"),
  }),
  { dismissModalCallback, activateModalCallback },
)(_Modal);

export { Modal };
