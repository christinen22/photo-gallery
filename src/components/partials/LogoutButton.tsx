import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase.config";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
