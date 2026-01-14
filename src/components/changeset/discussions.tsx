import { parse } from "date-fns";
import AnchorifyText from "react-anchorify-text";
import { useAuth } from "../../hooks/useAuth";

import AssemblyAnchor from "../assembly_anchor";
import { RelativeTime } from "../relative_time";
import { CommentForm } from "./comment";
import { SignInButton } from "./sign_in_button";
import TranslateButton from "./translate_button";
import { UserOSMLink } from "./user_osm_link";

interface DiscussionsProps {
  discussions: any[];
  changesetId: number;
  changesetAuthor: string;
  changesetIsHarmful: boolean;
}

function Discussions({
  discussions,
  changesetId,
  changesetAuthor,
  changesetIsHarmful,
}: DiscussionsProps) {
  const { token, user: userDetails } = useAuth();

  const renderComments = () => {
    if (discussions.length === 0) {
      return (
        <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
          <svg className="icon icon--xxl color-darken25">
            <use xlinkHref="#icon-contact" />
          </svg>
          <p className="txt-m">{"No discussions, yet."}</p>
        </div>
      );
    } else {
      return (
        <div className="">
          {discussions.map((comment, i) => (
            <div
              key={i}
              className="flex-parent flex-parent--column justify--space-between border border--gray-light round p6 my6 mt12"
            >
              <div className="flex-parent flex-parent--row justify--space-between txt-s ">
                <span>
                  By{" "}
                  <strong>
                    <UserOSMLink
                      userName={comment.user}
                      linkClasses={"txt-underline-on-hover cursor-pointer"}
                    >
                      {comment.user}
                    </UserOSMLink>{" "}
                  </strong>
                  {changesetAuthor === comment.user && (
                    <span style={{ color: "#aaa" }}>(changeset author)</span>
                  )}
                </span>
                <span>
                  <RelativeTime
                    datetime={parse(
                      comment.date,
                      "yyyy-MM-dd'T'HH:mm:ssX",
                      new Date(),
                    )}
                  />
                </span>
              </div>
              <div className="flex-parent flex-parent--column mt6 mb3">
                <p className="txt-break-url">
                  <AnchorifyText text={comment.text}>
                    <AssemblyAnchor />
                  </AnchorifyText>
                </p>
              </div>
              <div className="flex-parent justify--flex-end">
                <TranslateButton text={comment.text} />
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="px12 py6">
      <h2 className="txt-m mr6 mb3">
        <span className="txt-uppercase txt-bold">Discussions </span>
        for changeset by {changesetAuthor}
      </h2>
      {token ? (
        renderComments()
      ) : (
        <div>
          <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
            <svg className="icon icon--xxl color-darken25">
              <use xlinkHref="#icon-contact" />
            </svg>
          </div>
          <div className="flex-parent flex-parent--inline flex-parent--center-main mt6 mb3">
            <SignInButton text="Sign in to read and post comments" />
          </div>
        </div>
      )}
      {token && (
        <div className="flex-parent flex-parent--column justify--space-between my6 mt12">
          <CommentForm
            changesetId={changesetId}
            changesetIsHarmful={changesetIsHarmful}
            discussions={discussions}
            token={token}
            userDetails={userDetails}
          />
        </div>
      )}
    </div>
  );
}

export { Discussions };
