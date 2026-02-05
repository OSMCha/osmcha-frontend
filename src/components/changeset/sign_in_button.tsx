import { getAuthUrl } from "../../network/auth.ts";

interface SignInButtonProps {
  text: string;
  className?: string;
}

function SignInButton({ text, className }: SignInButtonProps) {
  const handleLoginClick = () => {
    getAuthUrl().then((res) => {
      window.location.assign(res.auth_url);
    });
  };

  const extraClasses = className
    ? className
    : "border--darken5 border--darken25-on-hover bg-darken10 bg-darken5-on-hover color-gray";

  return (
    <button
      onClick={handleLoginClick}
      className={`btn btn--s border border--1 round transition ${extraClasses}`}
    >
      <svg className="icon w18 h18 inline-block align-middle pr3">
        <use xlinkHref="#icon-osm" />
      </svg>
      {text}
    </button>
  );
}

export { SignInButton };
