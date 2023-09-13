import { useState, useRef } from "react";
import { FirebaseError } from "firebase/app";
import { useForm, SubmitHandler } from "react-hook-form";
import { RegisterCredentials } from "../types";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import {
  Form,
  Button,
  Alert,
  Container,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterCredentials>();
  const navigate = useNavigate();

  const passwordRef = useRef("");
  passwordRef.current = watch("password");

  const handleRegistration: SubmitHandler<RegisterCredentials> = async (
    data
  ) => {
    setError(null);
    try {
      const userCredential = await signup(data.email, data.password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: username,
      });
      navigate("/home");
      console.log("User registered:", user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }

    console.log("Data: ", data);
  };

  return (
    <Container className="py-3 center-y">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="login-container">
            <Card.Body>
              <Card.Title className="mb-3">Sign Up</Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit(handleRegistration)}>
                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="email"
                      {...register("email", {
                        required: "You have to enter an email",
                      })}
                      className="login-textBox"
                      placeholder="Enter email"
                    />

                    {errors.email && (
                      <p className="invalid">
                        {errors.email.message ?? "Invalid value"}
                      </p>
                    )}
                  </div>
                </Form.Group>

                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="text"
                      className="login-textBox"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      className="login-textBox"
                      {...register("password", {
                        required: "Enter a password",
                        minLength: {
                          value: 3,
                          message: "Please enter at least 3 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="invalid">
                        {errors.password.message ?? "Invalid value"}
                      </p>
                    )}
                  </div>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="password"
                      autoComplete="off"
                      className="login-textBox"
                      placeholder="Password confirm"
                      {...register("passwordConfirm", {
                        required: "Enter your password again.",
                        minLength: {
                          value: 3,
                          message: "Please enter at least 3 characters",
                        },
                        validate: (value) => {
                          return (
                            value === passwordRef.current ||
                            "The passwords does not match 🤦🏼‍♂️"
                          );
                        },
                      })}
                    />
                    {errors.passwordConfirm && (
                      <p className="invalid">
                        {errors.passwordConfirm.message ?? "Invalid value"}
                      </p>
                    )}
                  </div>
                </Form.Group>
                <Button variant="primary" className="login-btn" type="submit">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <p className="text-sm text-white text-center">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
