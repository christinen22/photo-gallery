import { useState, useRef, useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateProfileData } from "../types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { storage } from "../services/firebase.config";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
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
  const {
    currentUser,
    reloadUser,
    setDisplayName,
    setEmail,
    setPassword,
    setPhotoUrl,
  } = useAuth();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    defaultValues: {
      email: currentUser?.email ?? "",
      displayName: currentUser?.displayName ?? "",
    },
  });
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef("");
  passwordRef.current = watch("password");

  const photoFileRef = useRef<FileList | null>(null);
  photoFileRef.current = watch("photoFile");

  const onUpdateProfile: SubmitHandler<UpdateProfileData> = async (data) => {
    setError(null);

    if (currentUser) {
      try {
        if (data.displayName !== (currentUser.displayName ?? "")) {
          console.log("Updating display name...");
          await setDisplayName(data.displayName);
        }

        if (data.email !== (currentUser.email ?? "")) {
          console.log("Updating email...");
          await setEmail(data.email);
        }

        if (data.password) {
          console.log("Updating password...");
          await setPassword(data.password);
        }

        if (data.photoFile.length) {
          const photo = data.photoFile[0];

          // create a reference to upload the file to
          // example: "photos/3PjBWeCaZmfasyz4jTEURhnFtI83/space.jpg"
          const fileRef = ref(
            storage,
            `photos/${currentUser.uid}/${photo.name}`
          );

          try {
            // upload photo to fileRef
            const uploadResult = await uploadBytes(fileRef, photo);

            // get download url to uploaded file
            const photoUrl = await getDownloadURL(uploadResult.ref);

            console.log(
              "Photo successfully uploaded, download url is: " + photoUrl
            );

            // set download url as the users photoURL
            await setPhotoUrl(photoUrl);
          } catch (e) {
            console.log("Upload failed", e);
            setError("Upload failed!");
          }
        }

        // Reload user data
        await reloadUser();

        // Show success toast
        toast.success("Profile successfully updated");
      } catch (error) {
        if (error instanceof FirebaseError) {
          setError(error.message);
        } else {
          setError("Something went wrong.");
        }
      }

      console.log("Data: ", data);
    }
  };

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
                  <Form.Label>Photo</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="file"
                      accept="image/gif,image/jpeg,image/png,image/webp"
                      {...register("photoFile")}
                    />
                    <Form.Text>
                      {photoFileRef.current &&
                        photoFileRef.current.length > 0 && (
                          <span>
                            {photoFileRef.current[0].name} (
                            {Math.round(photoFileRef.current[0].size / 1024)}{" "}
                            kB)
                          </span>
                        )}
                    </Form.Text>
                  </div>
                </Form.Group>

                {currentUser && currentUser.photoURL && (
                  <div className="mb-3">
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </div>
                )}

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="email"
                      placeholder="email"
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
                          value: 3,
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
