import { useState, useEffect } from "react";
import { auth } from "../services/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      navigate("/home");
      console.log("User logged in:", user);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (loading) {
      toast.info("Loading..."); // Display a loading message
      return;
    }
    if (user) navigate("/home");
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login-container">
        <h2>Login</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              className="login-textBox"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className="login-textBox"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            className="login-btn"
            type="button"
            onClick={handleLogin}
          >
            Login
          </Button>

          <p className="text-sm text-white text-center">
            No account yet? <Link to="/register">Sign up</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
