import {
  ActionCodeSettings,
  AuthError,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRef, useCallback, FormEvent, useState } from "react";
import styled from "styled-components";
import { auth } from "../utils/firebaseConfig";
import { useUserContext } from "./context/UserProvider";
import Input from "./Input";
import Button from "./Button";

export default function ForgotPasswordForm({ role }: { role: string }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const { addModal } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
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
        addModal({
          id: Date.now(),
          type: "success",
          show: true,
          msg: "Check your email!",
          ms: 4000,
        });
      } catch (error) {
        const err = error as AuthError;
        switch (err.code) {
          case "auth/missing-email":
            addModal({
              id: Date.now(),
              type: "error",
              show: true,
              msg: "Missing email!",
              ms: 4000,
            });
            break;
          case "auth/user-not-found":
            addModal({
              id: Date.now(),
              type: "error",
              show: true,
              msg: "User not found",
              ms: 4000,
            });
            break;
          default:
            addModal({
              id: Date.now(),
              type: "error",
              show: true,
              msg: "Something went wrong!",
              ms: 4000,
            });
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [addModal]
  );

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2 className="title">Forgot password</h2>
        <Input
          label="Enter email to receive the reset link"
          ref={emailRef}
          type="email"
        />
        <div>
          <Button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Receive link"}
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
