import { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../services/firebase.config";
import { User } from "firebase/auth";
import NoAuth from "../pages/NoAuth";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const collectionRef = collection(db, "fileMetadata");

  const types = ["image/png", "image/jpeg"];
  const navigate = useNavigate();

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
  };

  useEffect(() => {
    console.log("File:", file);
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      console.log("Uploading file:", file);
      const timestamp = Date.now();
      const imageName = `image_${timestamp}_${file.name}`;
      const storageRef = ref(storage, `images/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setPercent(percent);
        },
        (error: Error) => {
          toast.error("Upload failed. Please try again later.");
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            const imageData = {
              uploader: user?.displayName,
              timestamp: serverTimestamp(),
              imageUrl: url,
            };
            return addDoc(collectionRef, imageData).then((docRef: any) => {
              console.log("Image metadata added with ID: ", docRef.id);
              toast.success("Image uploaded successfully!");
              window.location.reload();
            });
          });
        }
      );
    } else {
      toast.error("No file selected.");
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
        </div>
      ) : (
        <NoAuth />
      )}
    </>
  );
};

export default UploadForm;
