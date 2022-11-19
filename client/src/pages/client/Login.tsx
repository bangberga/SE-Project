import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import { useGlobalContext } from "../../App";

type Error = {
  show: boolean;
  msg: string;
};

export default function Login() {
  const googleProvider = new GoogleAuthProvider();
  const { setUser } = useGlobalContext();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [remember, setRemember] = useState<boolean>(true);
  const [error, setError] = useState<Error>({ show: false, msg: "" });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current || !passwordRef.current) return;
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      if (remember) await setPersistence(auth, browserLocalPersistence);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, googleProvider);
      if (remember) await setPersistence(auth, browserLocalPersistence);
      setUser(user.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemember = (e: ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked);
  };

  return (
    <section>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" ref={emailRef} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" ref={passwordRef} />
        </div>
        <button type="submit">Login</button>
        <div>
          <input type="checkbox" onChange={handleRemember} checked={remember} />
          <span>Remember me</span>
        </div>
      </form>
      Or
      <br />
      <button type="button" onClick={handleLoginWithGoogle}>
        Sign in with Google
      </button>
    </section>
  );
}
