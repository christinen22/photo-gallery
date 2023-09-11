import LogoutButton from "../components/partials/LogoutButton";
import UploadForm from "../components/UploadForm";
import PhotoDisplay from "../components/PhotoDisplay";
import { auth } from "../services/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";

import NoAuth from "./NoAuth";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      {user ? (
        <div>
          <LogoutButton />

          <PhotoDisplay />
        </div>
      ) : (
        <NoAuth />
      )}
    </>
  );
};

export default Home;
