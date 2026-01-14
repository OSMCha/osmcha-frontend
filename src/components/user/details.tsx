import { useEffect, useState } from "react";
import thumbsDown from "../../assets/thumbs-down.svg";
import thumbsUp from "../../assets/thumbs-up.svg";
import { useAuth } from "../../hooks/useAuth";
import { useUpdateUserDetails } from "../../query/hooks/useUpdateUserDetails";
import { Button } from "../button";

function renderGoodBadImg(isGood: boolean) {
  return (
    <img
      src={isGood ? thumbsUp : thumbsDown}
      alt={`${isGood ? "good" : "bad"}`}
      className="icon inline-block mt3"
    />
  );
}

function EditUserDetails() {
  const { token, user } = useAuth();
  const updateMutation = useUpdateUserDetails();

  const [messageGood, setMessageGood] = useState(user?.message_good || "");
  const [messageBad, setMessageBad] = useState(user?.message_bad || "");
  const commentFeature = user?.comment_feature ?? false;

  useEffect(() => {
    if (user) {
      setMessageGood(user.message_good || "");
      setMessageBad(user.message_bad || "");
    }
  }, [user]);

  const handleSubmit = () => {
    if (!token) return;

    updateMutation.mutate({
      token,
      messageGood,
      messageBad,
      commentFeature,
    });
  };

  return (
    <div>
      <span className="ml12 flex-parent flex-parent--row my3 pt12">
        <p className="flex-child txt-m">
          Default comment for changesets reviewed as GOOD{" "}
          {renderGoodBadImg(true)}:
        </p>
      </span>
      <textarea
        placeholder="Define a default message to the changesets you review as good. You can edit it before post a comment."
        className="textarea ml12"
        value={messageGood}
        onChange={(e) => setMessageGood(e.target.value)}
      />
      <span className="ml12 flex-parent flex-parent--row my3 pt18">
        <p className="flex-child txt-m">
          Default comment for changesets reviewed as BAD{" "}
          {renderGoodBadImg(false)}:
        </p>
      </span>
      <textarea
        placeholder="Define a default message to the changesets you review as bad. You can edit it before post a comment."
        className="textarea ml12"
        value={messageBad}
        onChange={(e) => setMessageBad(e.target.value)}
      />
      <Button
        className="input wmax180 ml12 mt6"
        onClick={handleSubmit}
        disabled={updateMutation.isPending}
      >
        Save Preferences
      </Button>
    </div>
  );
}

export { EditUserDetails };
