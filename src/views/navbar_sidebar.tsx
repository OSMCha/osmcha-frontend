import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Dropdown } from "../components/dropdown";
import { Navbar } from "../components/navbar";
import { useAuth } from "../hooks/useAuth";
import { getAuthUrl } from "../network/auth";
import { useAuthStore } from "../stores/authStore";
import { isMobile } from "../utils";

function NavbarSidebar() {
  const { token, user } = useAuth();
  const oAuthToken = useAuthStore((s) => s.oAuthToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = isMobile();

  const handleLoginClick = () => {
    getAuthUrl().then((res) => {
      window.location.assign(res.auth_url);
    });
  };

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate("/");
  };

  const onUserMenuSelect = (arr: Array<any>) => {
    const username = user?.username;
    const uid = user?.uid;

    if (arr.length === 1) {
      if (arr[0].url === "/logout") {
        handleLogout();
        return;
      }
      if (arr[0].url === "/my-changesets") {
        navigate({
          pathname: "/",
          search: `filters={"uids":[{"label":"${uid}","value":"${uid}"}],"date__gte":[{"label":"","value":""}]}`,
        });
        return;
      }
      if (arr[0].url === "/my-reviews") {
        navigate({
          pathname: "/",
          search: `filters={"checked_by":[{"label":"${username}","value":"${username}"}],"date__gte":[{"label":"","value":""}]}`,
        });
        return;
      }
      navigate({
        pathname: arr[0].url,
        search: location.search,
      });
    } else if (arr.length > 1) {
      throw new Error("filter select array is big");
    }
  };

  const renderUserMenuOptions = () => {
    const username = user?.username;

    return (
      <Dropdown
        display={
          username ? (
            <span className="wmax180 align-middle inline-block txt-truncate">
              {username}
            </span>
          ) : (
            "User"
          )
        }
        options={[
          { label: "Account settings", url: "/user" },
          {
            label: "My Changesets",
            url: "/my-changesets",
          },
          {
            label: "My Reviews",
            url: "/my-reviews",
          },
          { label: "My Saved Filters", url: "/saved-filters" },
          { label: "My Teams", url: "/teams" },
          { label: "My Trusted Users List", url: "/trusted-users" },
          { label: "My Watchlist", url: "/watchlist" },
          { label: "Logout", url: "/logout" },
        ]}
        onChange={onUserMenuSelect}
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        position="right"
      />
    );
  };

  return (
    <Navbar
      className="navbar-logo bg-gray-faint border-b border--gray-light border--1"
      title={
        <Link
          to={{
            search: window.location.search,
            pathname: "/",
          }}
          style={mobile ? { fontSize: "1.4em" } : { fontSize: "1.7em" }}
          className="color-gray"
        >
          <strong className="color-blue">OSM</strong>
          Cha
        </Link>
      }
      buttons={
        <div className="flex-parent flex-parent--row">
          <Link
            className="pr3 pointer"
            to={{
              search: window.location.search,
              pathname: "/about",
            }}
          >
            <svg className="icon icon--m inline-block align-middle color-darken25 color-darken50-on-hover transition">
              <use xlinkHref="#icon-question" />
            </svg>
          </Link>
          {token ? (
            <div className="pointer">{renderUserMenuOptions()}</div>
          ) : (
            <Button
              onClick={handleLoginClick}
              disable={!oAuthToken}
              iconName="osm"
            >
              Sign in
            </Button>
          )}
        </div>
      }
    />
  );
}

export { NavbarSidebar };
