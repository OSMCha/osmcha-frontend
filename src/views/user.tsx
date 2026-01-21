import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/avatar";
import { Button } from "../components/button";
import { EditUserDetails } from "../components/user/details";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import { isMobile } from "../utils/isMobile";

interface UserData {
  avatar?: string;
  username?: string;
  id?: string | number;
  uid?: string | number;
  is_staff?: boolean;
  [key: string]: any;
}

function User() {
  const { token, user } = useAuth();
  const currentUser = user as UserData | undefined;
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mobile = isMobile();

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate("/");
  };

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white${
        mobile ? "viewport-full" : ""
      }`}
    >
      <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
        <span className="txt-l txt-bold color-gray--dark">
          <span>Account Settings</span>
        </span>

        <span className="txt-l color-gray--dark">
          <Button onClick={handleLogout} className="bg-white-on-hover">
            Logout
          </Button>
        </span>
      </header>
      <div className="px30 flex-child  pb60  filters-scroll">
        <span className="flex-parent flex-parent--row align justify--space-between  mr6 txt-bold mt24">
          <Avatar size={72} url={currentUser?.avatar || ""} />
          <span
            className="flex-child flex-child--grow pl24  pt18"
            style={{ alignSelf: "center" }}
          >
            <h2 className="txt-xl">
              Welcome, {currentUser?.username || "stranger"}!
            </h2>
            <div className="flex-child flex-child--grow">&nbsp;</div>
          </span>
        </span>
        <div className="flex-parent flex-parent--column align justify--space-between">
          <h2 className="pl12 txt-xl mr6 txt-bold mt24 mb12 border-b border--gray-light border--1">
            Info
          </h2>
          <span className="ml12 flex-parent flex-parent--row my3">
            <p className="flex-child txt-bold w120">OSMCha ID: </p>
            <p className="flex-child">{currentUser?.id}</p>
          </span>
          <span className="ml12 flex-parent flex-parent--row my3">
            <p className="flex-child txt-bold w120">OSM ID: </p>
            <p className="flex-child">{currentUser?.uid}</p>
          </span>
          <span className="ml12 flex-parent flex-parent--row my3">
            <p className="flex-child txt-bold w120">Username: </p>
            <p className="flex-child">{currentUser?.username}</p>
          </span>
          {currentUser?.is_staff && (
            <span className="ml12 flex-parent flex-parent--row my3">
              <p className="flex-child txt-bold w120">Staff: </p>
              <p className="flex-child">Yes</p>
            </span>
          )}
          <span className="ml12 flex-parent flex-parent--row my3">
            <p className="flex-child txt-bold w120">API key: </p>
            <p className="flex-child">
              <span className="pre pb6 pt6">Token {token}</span>
              <div
                className="txt--s pl6 pointer inline"
                onClick={() => navigator.clipboard.writeText(`Token ${token}`)}
                title="Copy Authorization Token"
              >
                <svg className="icon icon--m mt-neg3 inline-block align-middle color-darken25 color-darken50-on-hover transition">
                  <use xlinkHref="#icon-clipboard" />
                </svg>
              </div>
            </p>
          </span>

          {token && (
            <div>
              <div className="mt24 mb12">
                <h2 className="pl12 txt-xl mr6 txt-bold border-b border--gray-light border--1">
                  Review Comments Template
                </h2>
                <EditUserDetails />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { User };
