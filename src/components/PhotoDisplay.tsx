import React, { useState, useEffect } from "react";
import { storage } from "../services/firebase.config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { auth } from "../services/firebase.config";

const PhotoDisplay: React.FC = () => {
  const [TNImageUrls, setTNImageUrls] = useState<string[]>([]);
  const [largeImageUrls, setLargeImageUrls] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

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
  console.log("CurrentUser in PhotoDisplay:", user);

  return (
    <div>
      <h2>Photo Gallery</h2>
      <div className="image-container">
        {TNImageUrls.map((TNImageUrl, index) => (
          <div key={index} className="thumbnail-container">
            <img
              src={TNImageUrl}
              alt={`Thumbnail ${index}`}
              onClick={() => handleImageClick(index)}
            />
          </div>
        ))}
      </div>

      {/* Modal or lightbox to display the larger image */}
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
