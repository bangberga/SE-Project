import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  AuthError,
} from "firebase/auth";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  FormEvent,
  useMemo,
  ChangeEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Input from "./Input";
import { auth } from "../utils/firebaseConfig";
import strongPasswordChecker from "../utils/strongPasswordChecker";
import debouce from "../utils/debounce";
import { useUserContext } from "./context/UserProvider";
import { AiOutlineLock } from "react-icons/ai";
import usePasswordLevel from "../customs/hooks/usePasswordLevel";
import PasswordLevel from "./PasswordLevel";
import Button from "./Button";

interface ResetPasswordFormProps {
  continueUrl: string;
}

export default function ResetPasswordForm(props: ResetPasswordFormProps) {
  const { continueUrl } = props;
  const [search] = useSearchParams();
  const { addModal } = useUserContext();
  const actionCode = search.get("oobCode");
  const [email, setEmail] = useState<string>("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const [level, handleLevel] = usePasswordLevel();
  const [error, setError] = useState<boolean>(false);

  const handleChangePassword = useMemo(
    () =>
      debouce((e: ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        handleLevel(password === "" ? null : strongPasswordChecker(password));
      }),
    [handleLevel]
  );

  const handleResetPassword = useCallback(async () => {
    try {
      const email = await verifyPasswordResetCode(auth, actionCode as string);
      setEmail(email);
    } catch (error) {
      setError(true);
    }
  }, [actionCode]);

  const handleConfirmPassword = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      const password = passwordRef.current;
      if (!password) return;
      e.preventDefault();
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
      try {
        await confirmPasswordReset(auth, actionCode as string, password.value);
        addModal({
          id: Date.now(),
          show: true,
          msg: "Password reseted!",
          type: "success",
          ms: 4000,
        });
      } catch (error) {
        const err = error as AuthError;
        switch (err.code) {
          case "auth/invalid-action-code":
            setError(true);
            break;
        }
      }
    },
    [level, actionCode, addModal]
  );

  useEffect(() => {
    handleResetPassword();
  }, [handleResetPassword]);

  if (error)
    return (
      <ErrorWrapper>
        <div className="card">
          <h2>Try resetting your password again</h2>
          <p>
            Your request to reset your password has expired or the link has
            already been used
          </p>
        </div>
      </ErrorWrapper>
    );
  return (
    <Wrapper>
      <form onSubmit={handleConfirmPassword}>
        <h2 className="title">Enter new password</h2>
        <p>Email: {email}</p>
        <div>
          <Input
            label="Password"
            type="password"
            ref={passwordRef}
            icon={AiOutlineLock}
            onChange={handleChangePassword}
          />
          <PasswordLevel level={level} />
        </div>
        <div>
          <Button type="submit" className="btn-primary">
            Reset
          </Button>
        </div>
        <p>
          Go back to{" "}
          <a href={continueUrl} className="text-btn">
            Login
          </a>
        </p>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  margin: auto;
  height: max-content;
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

const ErrorWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  margin: auto;
  height: 100vh;
  .card {
    padding: 20px;
    background: var(--mainWhite);
    height: max-content;
    h2 {
      letter-spacing: 0;
      color: var(--primaryColor);
    }
  }
`;
