import LogoutButton from "./LogoutButton";
import UploadForm from "./UploadForm";
import PhotoDisplay from "./PhotoDisplay";
import { auth } from "../services/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  console.log("User:", user);
  return (
    <div>
      <LogoutButton />

      <h1>Welcome to your page</h1>

      <UploadForm />
      <PhotoDisplay />
    </div>
  );
};

export default Home;
