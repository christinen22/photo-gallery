import LogoutButton from "../components/partials/LogoutButton";
import PhotoDisplay from "../components/PhotoDisplay";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import NoAuth from "./NoAuth";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser ? (
        <div>
          Welcome {currentUser!.displayName}
          {currentUser && currentUser.photoURL && (
            <div className="mb-3">
              <img
                src={currentUser.photoURL}
                alt="Profile"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </div>
          )}
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
