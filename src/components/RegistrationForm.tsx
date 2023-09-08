import { useState } from "react";
import { auth } from "../services/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User registered:", user);
    } catch (error) {
      setError(true);
      console.error("Registration failed:", error);
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
