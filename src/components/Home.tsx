import LogoutButton from "./LogoutButton";
import UploadForm from "./UploadForm";
import PhotoDisplay from "./PhotoDisplay";

const Home = () => {
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
