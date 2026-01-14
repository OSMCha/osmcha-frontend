import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter<P extends object>(
  Component: React.ComponentType<P>,
): React.FC<Omit<P, "location" | "navigate" | "match">> {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...(props as P)}
        location={location}
        navigate={navigate}
        match={{ params }}
      />
    );
  };
}
