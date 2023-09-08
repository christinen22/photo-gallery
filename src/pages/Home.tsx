import LogoutButton from "../components/partials/LogoutButton";
import UploadForm from "../components/UploadForm";
import PhotoDisplay from "../components/PhotoDisplay";
import { auth } from "../services/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import UploadButton from "../components/partials/UploadButton";
import NoAuth from "./NoAuth";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  console.log("User:", user);
  return (
    <>
      {user ? (
        <div>
          <LogoutButton />
          <UploadButton />

          <h1>Welcome to your page</h1>

          <PhotoDisplay />
        </div>
      ) : (
        <NoAuth />
      )}
    </>
  );
};

export default Home;
