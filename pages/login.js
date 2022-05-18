import { useEffect } from "react";
import { useUser } from "../context/user";

const Login = () => {
  const { login } = useUser();
  useEffect(() => {
    login();
  });
  return <div>logging in...</div>;
};

export default Login;
