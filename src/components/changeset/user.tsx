import { parse } from "date-fns";
import React from "react";
import Markdown from "react-markdown";
import { Link } from "react-router";
import remarkGfm from "remark-gfm";
import { getObjAsQueryParam } from "../../utils/query_params.ts";
import { Avatar } from "../avatar.tsx";
import { RelativeTime } from "../relative_time.tsx";
import { SignInButton } from "./sign_in_button.tsx";
import { TrustWatchUser } from "./trust_watch_user.tsx";
import { UserOSMLink } from "./user_osm_link.tsx";

interface UserDetails {
  uid?: number | string;
  name?: string;
  img?: string;
  accountCreated?: string;
  count?: number;
  changesets_in_osmcha?: number;
  harmful_changesets?: number;
  checked_changesets?: number;
  description?: string;
}

interface UserLinkProps {
  userDetails: UserDetails;
  harmful: boolean;
}

class UserLink extends React.PureComponent<UserLinkProps> {
  getHarmfulObject() {
    if (this.props.harmful) {
      return {
        label: "Show Bad only",
        value: true,
      };
    } else {
      return {
        label: "Show Good only",
        value: false,
      };
    }
  }
  getLinkContent() {
    if (this.props.harmful) {
      return `${this.props.userDetails.harmful_changesets} Bad`;
    } else {
      const count =
        this.props.userDetails.checked_changesets! -
        this.props.userDetails.harmful_changesets!;
      return `${count} Good`;
    }
  }
  render() {
    return (
      <Link
        className="txt-underline-on-hover txt-bold cursor-pointer color-gray"
        to={{
          search: getObjAsQueryParam("filters", {
            uids: [
              {
                label: this.props.userDetails.uid,
                value: this.props.userDetails.uid,
              },
            ],
            harmful: [this.getHarmfulObject()],
            date__gte: [{ label: "", value: "" }],
          }),
          pathname: "/",
        }}
      >
        {this.getLinkContent()}
      </Link>
    );
  }
}

interface UserProps {
  userDetails: UserDetails;
  whosThat: string[];
  changesetUsername?: boolean;
}

export class User extends React.PureComponent<UserProps> {
  renderUidFilterLink() {
    return (
      <Link
        className="txt-underline-on-hover txt-bold cursor-pointer color-gray"
        to={{
          search: getObjAsQueryParam("filters", {
            uids: [
              {
                label: this.props.userDetails.uid,
                value: this.props.userDetails.uid,
              },
            ],
            date__gte: [{ label: "", value: "" }],
          }),
          pathname: "/",
        }}
      >
        {`${this.props.userDetails.count} edits`}
      </Link>
    );
  }
  render() {
    const registrationDate = this.props.userDetails.accountCreated
      ? parse(
          this.props.userDetails.accountCreated,
          "yyyy-MM-dd'T'HH:mm:ssX",
          new Date(),
        )
      : null;

    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          User {this.props.userDetails.uid && `/ ${this.props.userDetails.uid}`}
        </h2>
        {this.props.userDetails.name ? (
          <div className="flex-parent flex-parent--column align-items--center justify--space-between mb6">
            <div>
              <Avatar size={96} url={this.props.userDetails.img} />
              <div className="mt6 txt-bold color-gray align-center">
                {this.props.userDetails.name}
              </div>
            </div>
            <div>
              <p className="txt-s color-gray align-center">
                {registrationDate != null && (
                  <React.Fragment>
                    Joined&nbsp;
                    <RelativeTime datetime={registrationDate} />
                    {" | "}
                  </React.Fragment>
                )}
                {this.props.userDetails.count
                  ? this.renderUidFilterLink()
                  : `${this.props.userDetails.changesets_in_osmcha} edits registered on OSMCha`}
              </p>
            </div>
            <div>
              <p className="txt-s color-gray align-center">
                <UserLink userDetails={this.props.userDetails} harmful={true} />
                &nbsp;and&nbsp;
                <UserLink
                  userDetails={this.props.userDetails}
                  harmful={false}
                />
                &nbsp;changesets
              </p>
            </div>

            <div className="mt6">
              <TrustWatchUser
                user={this.props.userDetails as { name: string; uid: number }}
              />
            </div>

            <div className="mt12">
              <Link
                className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                to={{
                  search: getObjAsQueryParam("filters", {
                    users: [
                      {
                        label: this.props.userDetails.name,
                        value: this.props.userDetails.name,
                      },
                    ],
                    date__gte: [{ label: "", value: "" }],
                  }),
                  pathname: "/",
                }}
              >
                OSMCha
              </Link>
              <UserOSMLink userName={this.props.userDetails.name}>
                OSM
              </UserOSMLink>
              <a
                target="_blank"
                rel="noopener noreferrer"
                title="Open in HDYC"
                className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                href={`https://hdyc.neis-one.org/?${this.props.userDetails.name}`}
              >
                HDYC
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Missing Maps"
                className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
                href={`https://www.missingmaps.org/users/#/${this.props.userDetails.name}`}
              >
                Missing Maps
              </a>
            </div>

            {this.props.whosThat.length > 1 && (
              <div className="txt-s color-gray">
                Past usernames: &nbsp;
                {this.props.whosThat.slice(0, -1).map((e, k) => (
                  <span key={k} className="txt-em">
                    {e}&nbsp;
                  </span>
                ))}
              </div>
            )}
            <div className="mt12">
              <div className="txt-subhead txt-s txt-break-url user-description">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {this.props.userDetails.description || ""}
                </Markdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-parent flex-parent--column align-items--center justify--space-between mb6">
            <div>
              <Avatar size={96} url={this.props.userDetails.img} />
              <div className="mt6 txt-bold color-gray align-center">
                {this.props.userDetails.name}
              </div>
            </div>
            <div className="flex-parent flex-parent--column mt6 mb3">
              <SignInButton text="Sign in to see the user details" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
