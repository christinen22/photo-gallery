import "./assets/scss/App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
//import PhotoDisplay from "./components/PhotoDisplay";
import Title from "./pages/Title";
import UploadForm from "./components/UploadForm";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
