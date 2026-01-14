export default {
  NOT_LOGGED_IN: {
    kind: "error",
    title: "Sign in required",
    description: "This action requires you to sign in first.",
  },
  MODIFY_SUCCESS: {
    kind: "success",
    title: "Successful",
    autoDismiss: 2,
    description: (changesetId) =>
      `The changeset ${changesetId} was successfully modified.`,
  },
};
