import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useRef,
  useState,
  ReactNode,
} from "react";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  inMemoryPersistence,
  AuthError,
} from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import styled from "styled-components";
import Input from "./Input";
import Button from "./Button";
import Checkbox from "./Checkbox";
import { useUserContext } from "./context/UserProvider";
import { FcGoogle } from "react-icons/fc";

interface LoginFormProps {
  forgotPasswordLink?: ReactNode;
}

export default function LoginForm(props: LoginFormProps) {
  const { forgotPasswordLink } = props;
  const { addModal } = useUserContext();
  const googleProvider = new GoogleAuthProvider();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [remember, setRemember] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!emailRef.current || !passwordRef.current) return;
      setLoading(true);
      try {
        await signInWithEmailAndPassword(
          auth,
          emailRef.current.value,
          passwordRef.current.value
        );
        if (remember) await setPersistence(auth, browserLocalPersistence);
        else await setPersistence(auth, inMemoryPersistence);
      } catch (error) {
        const err = error as AuthError;
        switch (err.code) {
          case "auth/wrong-password":
            addModal({
              id: Date.now(),
              type: "error",
              msg: "Wrong password!",
              show: true,
              ms: 4000,
            });
            break;
          case "auth/user-not-found":
            addModal({
              id: Date.now(),
              type: "error",
              msg: "Wrong email!",
              show: true,
              ms: 4000,
            });
            break;
          default:
            addModal({
              id: Date.now(),
              type: "error",
              msg: "Something went wrong",
              show: true,
              ms: 4000,
            });
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [remember, addModal]
  );

  const handleLoginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      if (remember) await setPersistence(auth, browserLocalPersistence);
      else await setPersistence(auth, inMemoryPersistence);
    } catch (error) {
      // handle error
    }
  }, [remember, googleProvider]);

  const handleCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked);
  }, []);

  return (
    <FormSection>
      <form onSubmit={handleLogin}>
        <h2 className="title">Login</h2>
        <Input
          label="Email"
          icon={AiOutlineMail}
          type="email"
          placeholder="Your email..."
          ref={emailRef}
        />
        <Input
          label="Password"
          icon={AiOutlineLock}
          type="password"
          placeholder="Your password..."
          ref={passwordRef}
        />
        <Checkbox
          lable="Remember me"
          onChange={handleCheck}
          checked={remember}
        />
        <div>
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginBottom: "10px" }}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          <Button
            onClick={handleLoginWithGoogle}
            icon={FcGoogle}
            disabled={loading}
            style={{ backgroundColor: "#eee", letterSpacing: 0 }}
            type="button"
          >
            Sign in with Google
          </Button>
        </div>
        <p>
          {forgotPasswordLink && (
            <>Forgot your password? {forgotPasswordLink}</>
          )}
        </p>
      </form>
    </FormSection>
  );
}

const FormSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin: 0;
    .text-btn {
      color: var(--primaryColor);
    }
  }
  form {
    background-color: var(--mainWhite);
    box-shadow: var(--darkShadow);
    padding: 20px 30px;
    min-width: 500px;
    div {
      margin-bottom: 10px;
    }
    .title {
      color: var(--primaryColor);
    }
  }
`;
