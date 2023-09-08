import LoginForm from "../components/LoginForm";

const NoAuth = () => {
  return (
    <div>
      <p>You are not logged in</p>
      <LoginForm />
    </div>
  );
};

export default NoAuth;
