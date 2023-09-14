import LogoutButton from "../components/partials/LogoutButton";
import PhotoDisplay from "../components/PhotoDisplay";
import { auth } from "../services/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import NoAuth from "./NoAuth";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      {user ? (
        <div>
          Welcome {user.displayName}
          <LogoutButton />
          <Link to="/update-profile">Update your profile</Link>
          <PhotoDisplay />
        </div>
      ) : (
        <NoAuth />
      )}
    </>
  );
};

export default Home;
