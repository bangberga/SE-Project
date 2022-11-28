import { useCallback, useMemo, useState } from "react";

export default function ShowHideText({
  children,
  max,
}: {
  children: string;
  max: number;
}) {
  const [isShow, setIsShow] = useState<boolean>(false);
  const text = useMemo(
    () => (isShow ? children : children.substring(0, max)),
    [isShow]
  );
  const handleShow = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);
  if (children.length < max) return <p>{children}</p>;
  return (
    <p>
      {text}{" "}
      <span className="link-text" onClick={handleShow}>
        {isShow ? "Hide less" : "Show more..."}
      </span>
    </p>
  );
}
