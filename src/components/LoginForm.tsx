import { useState } from "react";
import { auth } from "../services/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User logged in:", user);

      if (user) {
        navigate("/home");
      }
    } catch (error) {
      setError("Login failed. Please check your email and password.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleLogin}>
          Login
        </Button>

        <p className="text-sm text-white text-center">
          No account yet? <Link to="/register">Sign up</Link>
        </p>

        {error && <p className="text-danger">{error}</p>}
      </Form>
    </div>
  );
};

export default LoginForm;
