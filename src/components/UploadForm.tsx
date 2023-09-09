import { ChangeEvent, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../services/firebase.config";
import { User } from "firebase/auth";
import NoAuth from "../pages/NoAuth";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const collectionRef = collection(db, "fileMetadata");

  const navigate = useNavigate();
  const types = ["image/png", "image/jpeg"];

  // Check if the user is logged in
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select an image file, png or jpeg.");
    }

    console.log("Selected file:", selected);
  };

  console.log("UploadForm rendered");

  useEffect(() => {
    console.log("File:", file);
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      console.log("Uploading file:", file);
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      console.log("storageref", storageRef);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setPercent(percent);
        },
        (error: Error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            const imageData = {
              uploader: user?.email,
              timestamp: serverTimestamp(),
              imageUrl: url,
            };
            addDoc(collectionRef, imageData).then((docRef: any) => {
              console.log("Image metadata added with ID: ", docRef.id);
            });
          });
        }
      );
    } else {
      console.log("No file selected");
    }
  };

  return (
    <>
      {user ? (
        <div>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={changeHandler} />
            <button type="submit">Upload</button>
            <p>{percent} % done</p>
            <div className="output">
              {error && <div className="error">{error}</div>}
              {file && <div>{file.name}</div>}
            </div>
          </form>
          <NavLink to="/home">Go home</NavLink>
        </div>
      ) : (
        <NoAuth />
      )}
    </>
  );
};

export default UploadForm;
