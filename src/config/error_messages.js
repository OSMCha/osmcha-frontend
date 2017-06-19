// @flow
export const ADD_TAG_DEFAULT = {
  title: 'Action Failed',
  description: (changesetId: number) => 'Please try again later'
};

export const ADD_TAG_TO_UNCHECKED = {
  serverMessage: 'Only allowed on checked changesets',
  title: 'Tag Modification Failed',
  description: (
    changesetId: number
  ) => `Modification is only allowed on checked changesets.
                            Please check the changeset ${changesetId} and then modify the tags.`
};

export const ADD_TAG_TO_CHECKED_BY_OTHER = {
  serverMessage:
    'User can not add tags to a changeset checked by another user.',
  title: 'Tag Modification Failed',
  description: (changesetId: number) =>
    `The Changeset ${changesetId} is not checked by you. Modification is only allowed on changesets checked by you.`
};

export const ADD_TAG_NO_PERMISSION = {
  serverMessage: 'User does not have permission to uncheck this changeset.',
  title: 'Uncheck Failed',
  description: (changesetId: number) =>
    `The Changeset ${changesetId} can only be unchecked by staff or the person who checked it in the first place.`
};

export const NOT_LOGGED_IN = {
  title: 'Login required',
  description: (changesetId: number) =>
    'This action requires you to login first.'
};
