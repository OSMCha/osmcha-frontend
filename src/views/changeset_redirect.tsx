import { Navigate, useLocation, useParams } from "react-router";
import { NotFound } from "./not_found.tsx";

export function ChangesetRedirect() {
  const { id = "" } = useParams();
  const { search, hash } = useLocation();

  if (!/^\d+$/.test(id)) {
    return <NotFound />;
  }

  return (
    <Navigate replace to={{ pathname: `/changesets/${id}`, search, hash }} />
  );
}
