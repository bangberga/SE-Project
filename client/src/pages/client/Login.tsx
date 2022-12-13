import { Link } from "react-router-dom";
import LoginForm from "../../components/LoginForm";

export default function ClientLogin() {
  return (
    <LoginForm
      forgotPasswordLink={<Link to="/forgotpassword">Reset here</Link>}
    />
  );
}
