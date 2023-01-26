import axios, { AxiosError } from "axios";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiOutlineMail, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  AuthError,
  updateProfile,
  deleteUser,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../utils/firebaseConfig";
import strongPasswordChecker from "../utils/strongPasswordChecker";
import { uploadImages } from "../utils/storage";
import debouce from "../utils/debounce";
import Button from "./Button";
import Input from "./Input";
import { useUserContext } from "./context/UserProvider";
import usePasswordLevel from "../customs/hooks/usePasswordLevel";
import PasswordLevel from "./PasswordLevel";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface RegisterFormProps {
  role: string;
}

export default function RegisterForm(props: RegisterFormProps) {
  const { role } = props;
  const { addModal } = useUserContext();
  const googleProvider = new GoogleAuthProvider();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rePasswordRef = useRef<HTMLInputElement>(null);
  const [imgFiles, setImgFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [level, handleLevel] = usePasswordLevel();

  const handleChangePassword = useMemo(
    () =>
      debouce((e: ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        handleLevel(password === "" ? null : strongPasswordChecker(password));
      }),
    [handleLevel]
  );

  const handleChangeImg = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles(e.target.files);
  }, []);

  const register = useCallback(
    async (user: User, flag = true) => {
      try {
        await axios.post(
          `${baseUrl}/api/v1/auth/register?role=${role}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          }
        );
        if (imgFiles?.length && flag) {
          const fileNames = await uploadImages(
            imgFiles,
            `${user.uid}/profilePicture/`
          );
          await updateProfile(user, { photoURL: fileNames[0] });
        }
        addModal({
          id: Date.now(),
          show: true,
          msg: "Register successfully",
          type: "success",
          ms: 4000,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.message === "Network Error")
            return flag && deleteUser(user);
          const response = error.response as { data: any; status: number };
          if (response.status === 429) {
            addModal({
              id: Date.now(),
              type: "error",
              show: true,
              msg: response.data,
              ms: 4000,
            });
            return flag && deleteUser(user);
          }
          if (response.status === 400) {
            addModal({
              id: Date.now(),
              type: "error",
              show: true,
              msg: response.data.msg,
              ms: 4000,
            });
            return;
          }
        }
      }
    },
    [imgFiles, addModal]
  );

  const handleRegister = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!emailRef.current || !passwordRef.current || !rePasswordRef.current)
        return;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const rePassword = rePasswordRef.current.value;
      if (!email || !password) {
        addModal({
          id: Date.now(),
          show: true,
          msg: "Missing email or password",
          type: "error",
          ms: 4000,
        });
        return;
      }
      if (level === "WEAK") {
        addModal({
          id: Date.now(),
          show: true,
          msg: "Weak password",
          type: "error",
          ms: 4000,
        });
        return;
      }
      if (password !== rePassword) {
        addModal({
          id: Date.now(),
          show: true,
          msg: "Password does not match!",
          type: "error",
          ms: 4000,
        });
        return;
      }
      setLoading(true);
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await register(user);
        await sendEmailVerification(user);
      } catch (error) {
        const authErr = error as AuthError;
        const errorCode = authErr.code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            addModal({
              id: Date.now(),
              show: true,
              msg: "Email has already registered",
              type: "error",
              ms: 4000,
            });
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [level, register, addModal]
  );

  const handleRegisterWithGoogle = useCallback(async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await register(user, false);
    } catch (error) {
      const authErr = error as AuthError;
      const errorCode = authErr.code;
    }
  }, [googleProvider]);

  const preventCopy = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    return false;
  }, []);

  const preventPaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    return false;
  }, []);

  return (
    <Wrapper>
      <form onSubmit={handleRegister}>
        <h2 className="title">Register</h2>
        <Input
          type="email"
          label="Email"
          placeholder="Your email..."
          icon={AiOutlineMail}
          ref={emailRef}
        />
        <div>
          <Input
            type="password"
            label="Password"
            icon={AiOutlineLock}
            onCopy={preventCopy}
            onChange={handleChangePassword}
            ref={passwordRef}
            placeholder="Your password..."
          />
          <PasswordLevel level={level} />
        </div>
        <Input
          type="password"
          label="Enter password again"
          icon={AiOutlineUnlock}
          onPaste={preventPaste}
          ref={rePasswordRef}
          placeholder="Re-enter password..."
        />
        <Input
          label="Upload avatar"
          type="file"
          accept="image/*"
          onChange={handleChangeImg}
        />
        <div>
          <Button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginBottom: "10px" }}
          >
            {loading ? "Loading..." : "Sign up"}
          </Button>
          <Button
            onClick={handleRegisterWithGoogle}
            disabled={loading}
            icon={FcGoogle}
            style={{ backgroundColor: "#eee", letterSpacing: 0 }}
            type="button"
          >
            Sign up with Google
          </Button>
        </div>
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
