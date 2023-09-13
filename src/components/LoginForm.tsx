import { useState, useEffect } from "react";
import { auth } from "../services/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
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
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logging in...");
      //const user = userCredential.user;
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, loading]);

  return (
    <Container className="py-3 center-y">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="login-container">
            <Card.Title className="mb-3">Sign Up</Card.Title>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="email"
                    className="login-textBox"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div className="input-container">
                  <Form.Control
                    type="password"
                    className="login-textBox"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Button
                variant="primary"
                className="login-btn"
                type="button"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={12}>
          <p className="text-sm text-white text-center">
            No account yet? <Link to="/register">Sign up</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
