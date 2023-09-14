import { useState, useRef, useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateProfileData } from "../types";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  Card,
  Alert,
} from "react-bootstrap";
import useAuth from "../hooks/useAuth";

const UpdateProfile = () => {
  const { updateProfile, currentUser, updateEmail, updatePassword } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileData>();
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef("");
  passwordRef.current = watch("password");

  const onUpdateProfile: SubmitHandler<UpdateProfileData> = async (data) => {
    setError(null);

    if (currentUser) {
      // Update display name and photo URL
      try {
        await updateProfile(currentUser, data.displayName, data.photoURL);
      } catch (error) {
        if (error instanceof FirebaseError) {
          setError(error.message);
        } else {
          setError("Something went wrong.");
        }
      }
      // Update email and password if they are provided
      if (data.email) {
        try {
          // Update email
          await updateEmail(currentUser, data.email);

          // Update password
          await updatePassword(currentUser, data.password);
        } catch (error) {
          if (error instanceof FirebaseError) {
            setError(error.message);
          } else {
            setError("Something went wrong.");
          }
        }
      }

      console.log("Data: ", data);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setPhotoURL(currentUser.photoURL || "");
      setEmail(currentUser.email || "");
      setValue("displayName", currentUser.displayName || "");
      setValue("photoURL", currentUser.photoURL || "");
      setValue("email", currentUser.email || "");
    }
  }, [currentUser, setValue]);

  return (
    <Container className="py-3 center-y">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="login-container">
            <Card.Body>
              <Card.Title className="mb-3">Update Profile</Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit(onUpdateProfile)}>
                <Form.Group controlId="displayName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="text"
                      className="login-textBox"
                      placeholder="username"
                      {...register("displayName", {
                        required: "Display name is required",
                      })}
                    />
                    {errors.displayName && (
                      <span className="text-danger">
                        {errors.displayName.message}
                      </span>
                    )}
                  </div>
                </Form.Group>

                <Form.Group controlId="photoURL" className="mb-3">
                  <Form.Label>Photo URL</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="url"
                      placeholder="photo-url"
                      {...register("photoURL")}
                    />
                  </div>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="email"
                      placeholder="snelhest2000@horsemail.com"
                      {...register("email")}
                    />
                  </div>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="password"
                      autoComplete="new-password"
                      {...register("password", {
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <span className="text-danger">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="password"
                      autoComplete="off"
                      {...register("confirmPassword", {
                        validate: (value) =>
                          value === passwordRef.current ||
                          "Passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && (
                      <span className="text-danger">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </Form.Group>

                <Button variant="primary" className="login-btn" type="submit">
                  Update Profile
                </Button>
                <Link to="/home">Go home</Link>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProfile;
