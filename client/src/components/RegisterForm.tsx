import axios, { AxiosError } from "axios";
import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { auth } from "../utils/firebaseConfig";
import strongPasswordChecker from "../utils/strongPasswordChecker";
import { uploadImages } from "../utils/storage";
import debouce from "../utils/debounce";
import GoogleRegisterButton from "../components/GoogleButton";
import { Modal } from "../interfaces/Modal";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function RegisterForm({ role }: { role: string }) {
  const googleProvider = new GoogleAuthProvider();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [imgFiles, setImgFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [level, setLevel] = useState<"STRONG" | "MEDIUM" | "WEAK" | null>(null);
  const [modal, setModal] = useState<Modal>({ show: false, msg: "" });
  const handleChangePassword = useMemo(
    () =>
      debouce((e: ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setLevel(password === "" ? null : strongPasswordChecker(password));
      }),
    []
  );

  const handleChangeImg = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setImgFiles(e.target.files);
  }, []);

  const register = useCallback(async (user: User) => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        `${baseUrl}/api/v1/auth/register?role=${role}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      const err = error as AxiosError;
      if (err.message === "Network Error") deleteUser(user);
    }
  }, []);

  const handleRegister = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!emailRef.current || !passwordRef.current) return;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      if (!email || !password) {
        setModal({
          show: true,
          msg: "Missing email or password",
          type: "error",
        });
        return;
      }
      if (level === "WEAK") {
        setModal({ show: true, msg: "Weak password", type: "error" });
        return;
      }
      setLoading(true);
      setModal({ show: false, msg: "" });
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (imgFiles?.length) {
          const fileNames = await uploadImages(
            imgFiles,
            `${user.uid}/profilePicture/`
          );
          await updateProfile(user, { photoURL: fileNames[0] });
        }
        await register(user);
        setModal({ show: true, msg: "Register successfully", type: "success" });
        setLoading(false);
        await sendEmailVerification(user);
      } catch (error) {
        const authErr = error as AuthError;
        const errorCode = authErr.code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            setModal({
              show: true,
              msg: "Email has already registered",
              type: "error",
            });
            break;
        }
      }
    },
    [imgFiles, level]
  );

  const handleRegisterWithGoogle = useCallback(async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await register(user);
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (modal.show) {
      timeout = setTimeout(() => {
        setModal((prev) => ({ ...prev, show: false }));
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [modal.show]);

  return (
    <Wrapper>
      <form onSubmit={handleRegister}>
        <h2 className="title">Register</h2>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" ref={emailRef} className="text-input" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            onCopy={preventCopy}
            onPaste={preventPaste}
            onChange={handleChangePassword}
            className="text-input"
          />
          {level ? (
            <p>
              Password level:{" "}
              <span className={level.toLowerCase()}>{level}</span>
            </p>
          ) : (
            ""
          )}
        </div>
        <div>
          <label htmlFor="re-password">Enter password again</label>
          <input
            type="password"
            name="re-password"
            onPaste={preventPaste}
            onCopy={preventCopy}
            className="text-input"
          />
        </div>
        <div className="file-section">
          <label htmlFor="avatar">Upload avatar</label>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            onChange={handleChangeImg}
          />
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
            className="btn-primary block-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          <GoogleRegisterButton
            handle={handleRegisterWithGoogle}
            children="Sign up with Google"
            disabled={loading}
          />
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
