import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/button.tsx";
import { Dropdown } from "../components/dropdown.tsx";
import { Navbar } from "../components/navbar.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { getAuthUrl } from "../network/auth.ts";
import { useAuthStore } from "../stores/authStore.ts";
import { isMobile } from "../utils/isMobile.ts";

interface UserData {
  username?: string;
  uid?: string | number;
  [key: string]: any;
}

function NavbarSidebar() {
  const { token, user } = useAuth();
  const currentUser = user as UserData | undefined;
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
    const username = currentUser?.username;
    const uid = currentUser?.uid;

    if (arr.length === 1) {
      if (arr[0].href === "/logout") {
        handleLogout();
        return;
      }
      if (arr[0].href === "/my-changesets") {
        navigate({
          pathname: "/",
          search: `filters={"uids":[{"label":"${uid}","value":"${uid}"}],"date__gte":[{"label":"","value":""}]}`,
        });
        return;
      }
      if (arr[0].href === "/my-reviews") {
        navigate({
          pathname: "/",
          search: `filters={"checked_by":[{"label":"${username}","value":"${username}"}],"date__gte":[{"label":"","value":""}]}`,
        });
        return;
      }
      navigate({
        pathname: arr[0].href,
        search: location.search,
      });
    } else if (arr.length > 1) {
      throw new Error("filter select array is big");
    }
  };

  const renderUserMenuOptions = () => {
    const username = currentUser?.username;

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
          { label: "Account settings", href: "/user" },
          {
            label: "My Changesets",
            href: "/my-changesets",
          },
          {
            label: "My Reviews",
            href: "/my-reviews",
          },
          { label: "My Saved Filters", href: "/saved-filters" },
          { label: "My Teams", href: "/teams" },
          { label: "My Trusted Users List", href: "/trusted-users" },
          { label: "My Watchlist", href: "/watchlist" },
          { label: "Logout", href: "/logout" },
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
            <Button onClick={handleLoginClick} iconName="osm">
              Sign in
            </Button>
          )}
        </div>
      }
    />
  );
}

export { NavbarSidebar };
