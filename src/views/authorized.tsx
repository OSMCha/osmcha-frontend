import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { completeOAuthLogin } from "../utils/auth";

export function Authorized() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authCode = params.get("code");

    if (authCode) {
      completeOAuthLogin(authCode)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((error) => {
          console.error("OAuth completion failed:", error);
          navigate("/", { replace: true });
        });
    } else {
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  return <div className="center">Logging in...</div>;
}
