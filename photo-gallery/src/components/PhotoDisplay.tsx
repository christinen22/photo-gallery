import React, { useState, useEffect } from "react";
import { storage } from "../services/firebase.config";
import { ref, listAll, getDownloadURL } from "firebase/storage";

const PhotoDisplay: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    // Function to fetch image URLs from Firebase Storage
    const fetchImageUrls = async () => {
      try {
        const imagesRef = ref(storage, "images"); // Update the path as needed
        const imageList = await listAll(imagesRef);
        const urlsPromises = imageList.items.map(async (imageRef) => {
          return getDownloadURL(imageRef);
        });
        const urls = await Promise.all(urlsPromises);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    // Fetch image URLs when the component mounts
    fetchImageUrls();
  }, []);

  return (
    <div>
      <h2>Photo Gallery</h2>
      <div className="image-container">
        {imageUrls.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Image ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default PhotoDisplay;
