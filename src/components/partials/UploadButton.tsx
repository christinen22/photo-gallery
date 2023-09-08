import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UploadButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/upload");
  };
  return (
    <div>
      <Button onClick={handleClick}>Upload</Button>
    </div>
  );
};

export default UploadButton;
