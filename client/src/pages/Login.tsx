import { FormEvent, useRef } from "react";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { useGlobalContext } from "../App";

export default function Login() {
  const googleProvider = new GoogleAuthProvider();
  const { setUser } = useGlobalContext();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        emailRef.current?.value as string,
        passwordRef.current?.value as string
      );
      await setPersistence(auth, browserLocalPersistence);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, googleProvider);
      await setPersistence(auth, browserLocalPersistence);
      setUser(user.user);
    } catch (error) {
      console.error(error);
    }
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
      </form>
      Or
      <br />
      <button type="button" onClick={handleLoginWithGoogle}>
        Sign in with Google
      </button>
    </section>
  );
}
