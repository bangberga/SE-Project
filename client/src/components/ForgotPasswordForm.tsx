import {
  ActionCodeSettings,
  AuthError,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRef, useCallback, FormEvent, useState, useEffect } from "react";
import styled from "styled-components";
import { auth } from "../utils/firebaseConfig";
import { Modal } from "../interfaces/Modal";

export default function ForgotPasswordForm({ role }: { role: string }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<Modal>({ show: false, msg: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current;
    if (!email) return;
    const actionCodeSetting: ActionCodeSettings = {
      url: `http://127.0.0.1:5173/${role === "admin" ? "admin" : ""}/login`,
      handleCodeInApp: true,
    };
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.value, actionCodeSetting);
      setModal({ type: "success", show: true, msg: "Check your email!" });
    } catch (error) {
      const err = error as AuthError;
      switch (err.code) {
        case "auth/missing-email":
          setModal({ type: "error", show: true, msg: "Missing email!" });
          break;
        case "auth/user-not-found":
          setModal({ type: "error", show: true, msg: "User not found" });
          break;
        default:
          setModal({ type: "error", show: true, msg: "Something went wrong!" });
          break;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (modal.show) {
      timeout = setTimeout(() => {
        setModal((prev) => ({ ...prev, show: false }));
      }, 4000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [modal.show]);

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2 className="title">Forgot password</h2>
        <div>
          <label htmlFor="email">Enter email to receive the reset link</label>
          <input type="email" ref={emailRef} className="text-input" />
        </div>
        <div>
          {modal.show ? (
            <p className={modal.type ? modal.type : ""}>{modal.msg}</p>
          ) : (
            ""
          )}
        </div>
        <div>
          <button type="submit" className={"btn-primary block-btn"}>
            Receive link
          </button>
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
