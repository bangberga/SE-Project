import { useEffect } from "react";
import { setCookie } from "../../utils/cookie";
import ComingSoon from "../../components/ComingSoon";

export default function Home() {
  useEffect(() => {
    setCookie("navigateClientUrl", "/", 365);
  });
  return (
    <section>
      <ComingSoon />
    </section>
  );
}
