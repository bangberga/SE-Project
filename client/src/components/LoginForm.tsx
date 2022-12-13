import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useRef,
  useState,
  ReactNode,
} from "react";
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
import GoogleLoginButton from "../components/GoogleButton";
import Checkbox from "./Checkbox";
import useModal from "../customs/hooks/useModal";

interface LoginFormProps {
  forgotPasswordLink?: ReactNode;
}

export default function LoginForm(props: LoginFormProps) {
  const { forgotPasswordLink } = props;
  const googleProvider = new GoogleAuthProvider();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [remember, setRemember] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, handleModal] = useModal();

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
            handleModal({ type: "error", msg: "Wrong password!", show: true });
            break;
          case "auth/user-not-found":
            handleModal({ type: "error", msg: "Wrong email!", show: true });
            break;
          default:
            handleModal({
              type: "error",
              msg: "Something went wrong",
              show: true,
            });
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [remember, handleModal]
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
    <Wrapper>
      <form onSubmit={handleLogin}>
        <h2 className="title">Login</h2>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" ref={emailRef} className="text-input" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" ref={passwordRef} className="text-input" />
        </div>
        <div className="remember">
          <Checkbox handleCheck={handleCheck} checked={remember} />
          <span>Remember me</span>
        </div>
        <div>
          {modal.show ? (
            <p className={modal.type ? modal.type : ""}>{modal.msg}</p>
          ) : (
            ""
          )}
        </div>
        <div>
          <button
            type="submit"
            className={"btn-primary block-btn"}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <GoogleLoginButton
            handle={handleLoginWithGoogle}
            children="Sign in with Google"
            disabled={loading}
          />
        </div>
        <p>
          {forgotPasswordLink && (
            <>Forgot your password? {forgotPasswordLink}</>
          )}
        </p>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
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
    div {
      margin-bottom: 10px;
    }
    label {
      font-weight: bold;
      color: var(--primaryColor);
      display: block;
    }
    .title {
      color: var(--primaryColor);
    }
    .text-input {
      display: block;
      width: 500px;
      height: 40px;
      border: none;
      background-color: var(--mainBackground);
      border-radius: var(--mainBorderRadius);
      padding: 0 10px;
    }
    textarea {
      width: 100%;
      height: 50px;
      resize: none;
      padding: 5px;
    }
    .remember {
      display: flex;
      align-items: center;
    }
    .remember span {
      margin-left: 10px;
    }
    .weak,
    .medium,
    .strong {
      font-weight: bold;
    }
    .weak {
      color: var(--mainRed);
    }
    .medium {
      color: var(--mainOrange);
    }
    .strong {
      color: var(--mainGreen);
    }
    .success,
    .error {
      display: flex;
      justify-content: center;
      height: var(--inputHeight);
      border-radius: var(--mainBorderRadius);
      align-items: center;
    }
    .success {
      color: var(--mainGreen);
      background-color: var(--mainLightGreen);
    }
    .error {
      color: var(--mainRed);
      background-color: var(--mainLightRed);
    }
    .img-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
      gap: 10px;
    }
    .img-container img {
      width: 100%;
      height: 70px;
      object-fit: cover;
      margin-top: 10px;
    }
    .btn-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      align-items: center;
    }
    .block-btn {
      width: 100%;
      margin: 5px 0;
    }
  }
`;
