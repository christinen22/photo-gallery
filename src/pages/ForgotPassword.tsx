import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forgotPassword } = useAuth();

  const handleResetPassword = async () => {
    try {
      await forgotPassword(email);
      setIsPasswordReset(true);
      setError(null);
    } catch (error) {
      setError("Something went wrong");
    }
  };
  return (
    <div>
      <h2>Forgot Password</h2>
      {isPasswordReset ? (
        <>
          <p>
            Password reset email sent. Check your inbox for further
            instructions.
          </p>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <div>
          <p>Enter your email address to reset your password:</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
