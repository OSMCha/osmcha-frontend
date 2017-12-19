export default {
  NOT_LOGGED_IN: {
    kind: 'error',
    title: 'Sign in required',
    description: 'This action requires you to sign in first.'
  },
  MODIFY_SUCCESS: {
    kind: 'success',
    title: 'Successful',
    autoDismiss: 2,
    description: changesetId =>
      `The changeset ${changesetId} was successfully modified.`
  },
  NEWS: {
    kind: 'warning',
    title: 'News: Changeset Comments',
    autoDismiss: 0,
    dismiss: true,
    position: 'br',
    description: `From now on, when you review a changeset in OSMCha, it will post a comment on the changeset page. That way, we give feedback to the user who created it.`
  }
};
