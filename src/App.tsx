import "./assets/scss/App.scss";
import PhotoDisplay from "./components/PhotoDisplay";
import Title from "./components/Title";
import UploadForm from "./components/UploadForm";

const App = () => {
  return (
    <>
      <Title />
      <UploadForm />
      <PhotoDisplay />
    </>
  );
};

export default App;
