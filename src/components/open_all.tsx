type Props = {
  isActive: boolean;
  setOpenAll: (value: boolean) => void;
};

export const OpenAll = ({ isActive, setOpenAll }: Props) => (
  <div className="inline-block fr">
    <button
      className="txt-s txt-underline pointer"
      onClick={() => setOpenAll(!isActive)}
      role="switch"
      aria-checked={isActive}
      tabIndex={0}
    >
      {isActive ? "Close all" : "Open all"}
    </button>
  </div>
);
