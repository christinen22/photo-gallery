import React, { ChangeEvent, useState, useEffect } from "react";
import { storage } from "../services/firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth } from "../services/firebase.config";
import { User } from "firebase/auth";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

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

  console.log("User in upload: ", user);

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
            console.log(url);
          });
        }
      );
    } else {
      console.log("No file selected");
    }
  };

  return (
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
  );
};

export default UploadForm;
