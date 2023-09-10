import { useState } from "react";
import { auth } from "../services/firebase.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: username,
      });
      navigate("/home");
      console.log("User registered:", user);
    } catch (error) {
      setError(true);
      console.log("Registration failed:", error);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <h2>Registration</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              className="register-textBox"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              className="register-textBox"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              className="register-textBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            className="register-btn"
            type="button"
            onClick={handleRegistration}
          >
            Register
          </Button>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default RegistrationForm;
