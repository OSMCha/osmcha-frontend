import { useState, useEffect } from "react";
import thumbsDown from "../../assets/thumbs-down.svg";
import thumbsUp from "../../assets/thumbs-up.svg";
import { useAuth } from "../../hooks/useAuth";
import { useUpdateUserDetails } from "../../query/hooks/useUpdateUserDetails";
import { Button } from "../button";

function EditUserDetails() {
  const { token, user: userDetails } = useAuth();
  const updateMutation = useUpdateUserDetails();

  const [messageGood, setMessageGood] = useState("");
  const [messageBad, setMessageBad] = useState("");
  const [commentFeature, setCommentFeature] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setMessageGood(userDetails.message_good || "");
      setMessageBad(userDetails.message_bad || "");
      setCommentFeature(userDetails.comment_feature || false);
    }
  }, [userDetails]);

  const handleSubmit = () => {
    if (!token) return;
    updateMutation.mutate({
      token,
      messageGood,
      messageBad,
      commentFeature,
    });
  };

  const renderGoodBadImg = (isGood: boolean) => {
    return (
      <img
        src={isGood ? thumbsUp : thumbsDown}
        alt={`${isGood ? "good" : "bad"}`}
        className="icon inline-block mt3"
      />
    );
  };

  return (
    <div>
      <span className="ml12 flex-parent flex-parent--row my3">
        <p className="flex-child txt-s">
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
      <span className="ml12 flex-parent flex-parent--row my3 pt6">
        <p className="flex-child txt-s">
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
        {updateMutation.isPending ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}

export { EditUserDetails };
