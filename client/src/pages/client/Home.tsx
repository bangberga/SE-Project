import { useEffect } from "react";
import { setCookie } from "../../utils/cookie";

export default function Home() {
  useEffect(() => {
    setCookie("navigateUrl", "/", 365);
  });
  return <section>Home</section>;
}
