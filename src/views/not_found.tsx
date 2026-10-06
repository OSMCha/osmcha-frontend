import { Link, useLocation } from "react-router";

export function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="flex-parent flex-parent--column flex-parent--center-cross flex-parent--center-main h-full px12 align-center">
      <svg className="icon icon--xxl color-darken25">
        <use xlinkHref="#icon-alert" />
      </svg>
      <h1 className="txt-h3 txt-bold mt12">Page not found</h1>
      <p className="txt-m color-gray mt12">
        There's nothing at <code className="txt-code">{pathname}</code>.
      </p>
      <Link className="link txt-m mt12" to="/">
        Go to the home page
      </Link>
    </div>
  );
}
