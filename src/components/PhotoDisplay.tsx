import { useState, useEffect } from "react";
import { storage } from "../services/firebase.config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { auth, db } from "../services/firebase.config";
import UploadForm from "./UploadForm";
import { collection, getDocs } from "firebase/firestore";

const PhotoDisplay: React.FC = () => {
  const [uploader, setUploader] = useState<string[]>([]);
  const [TNImageUrls, setTNImageUrls] = useState<string[]>([]);
  const [largeImageUrls, setLargeImageUrls] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const collectionRef = collection(db, "fileMetadata");

  useEffect(() => {
    // Function to fetch image URLs from Firebase Storage
    const fetchTNImageUrls = async () => {
      try {
        const TNimagesRef = ref(storage, "thumbnails");
        const imageList = await listAll(TNimagesRef);
        const urlsPromises = imageList.items.map(async (imageRef) => {
          return getDownloadURL(imageRef);
        });
        const urls = await Promise.all(urlsPromises);
        setTNImageUrls(urls);
        const metaData = await getDocs(collectionRef);
        const userData = metaData.docs.map((doc) => {
          return doc.data();
        });

        console.log("Userdata: ", userData);

        const imageUploader = userData.map((doc) => {
          return doc.uploader;
        });

        setUploader(imageUploader);

        console.log(imageUploader);
      } catch (error) {
        console.error("Error fetching thumbnail image URLs:", error);
      }
    };

    // Function to fetch larger image URLs from Firebase Storage
    const fetchLargeImageUrls = async () => {
      try {
        const imagesRef = ref(storage, "images");
        const imageList = await listAll(imagesRef);
        const urlsPromises = imageList.items.map(async (imageRef) => {
          return getDownloadURL(imageRef);
        });
        const urls = await Promise.all(urlsPromises);
        setLargeImageUrls(urls);
      } catch {
        console.error("Error fetching larger image URLs");
      }
    };

    // Fetch image URLs only if the user is authenticated
    if (auth.currentUser) {
      fetchTNImageUrls();
      fetchLargeImageUrls();
    }
  }, []);

  // Function to handle image click and display the larger image
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index); // Store the selected image index
  };

  // Function to close the modal or lightbox
  const handleCloseModal = () => {
    setSelectedImageIndex(null); // Reset the selected image index to close the modal
  };

  const user = auth.currentUser;

  return (
    <div>
      <UploadForm />

      <h2>Photo Gallery</h2>
      <div className="image-container">
        {TNImageUrls.map((TNImageUrl, index) => (
          <div key={index} className="thumbnail-container">
            <img
              src={TNImageUrl}
              alt={`Thumbnail ${index}`}
              onClick={() => handleImageClick(index)}
            />
            {uploader[index] && <p>Uploader: {uploader[index]}</p>}
          </div>
        ))}
      </div>

      {/* lightbox to display the larger image */}
      {selectedImageIndex !== null && (
        <div className="modal">
          <button onClick={handleCloseModal}>Close</button>
          <img
            src={largeImageUrls[selectedImageIndex]}
            alt={`Image ${selectedImageIndex}`}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoDisplay;
