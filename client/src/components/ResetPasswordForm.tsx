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
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../utils/firebaseConfig";
import strongPasswordChecker from "../utils/strongPasswordChecker";
import debouce from "../utils/debounce";
import useModal from "../customs/hooks/useModal";

export default function ResetPasswordForm() {
  const [search] = useSearchParams();
  const actionCode = search.get("oobCode");
  const continueUrl = search.get("continueUrl");
  const [email, setEmail] = useState<string>("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const [level, setLevel] = useState<"STRONG" | "MEDIUM" | "WEAK" | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [modal, handleModal] = useModal();

  const handleChangePassword = useMemo(
    () =>
      debouce((e: ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setLevel(password === "" ? null : strongPasswordChecker(password));
      }),
    []
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
        handleModal({ show: true, msg: "Weak password", type: "error" });
        return;
      }
      try {
        await confirmPasswordReset(auth, actionCode as string, password.value);
        handleModal({ show: true, msg: "Password reseted!", type: "success" });
      } catch (error) {
        const err = error as AuthError;
        switch (err.code) {
          case "auth/invalid-action-code":
            setError(true);
            break;
        }
      }
    },
    [level, actionCode, handleModal]
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            className="text-input"
            onChange={handleChangePassword}
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
          {modal.show ? (
            <p className={modal.type ? modal.type : ""}>{modal.msg}</p>
          ) : (
            ""
          )}
        </div>
        <div>
          <button type="submit" className="btn-primary block-btn">
            Reset
          </button>
        </div>
        {continueUrl ? (
          <p>
            Go back to{" "}
            <Link to={continueUrl} className="text-btn">
              Login
            </Link>
          </p>
        ) : (
          ""
        )}
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
    .block-btn {
      width: 100%;
      margin: 5px 0;
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
