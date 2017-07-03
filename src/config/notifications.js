export default {
  NOT_LOGGED_IN: {
    kind: 'error',
    title: 'Login required',
    description: 'This action requires you to login first.'
  },
  MODIFY_SUCCESS: {
    kind: 'success',
    title: 'Successful',
    autoDismiss: 2,
    description: changesetId =>
      `The changeset ${changesetId} was successfully modified.`
  }
};
