import { useState, useEffect } from "react";
import { storage } from "../services/firebase.config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { auth, db } from "../services/firebase.config";
import UploadForm from "./UploadForm";
import { collection, getDocs } from "firebase/firestore";

const PhotoDisplay: React.FC = () => {
  const [imageData, setImageData] = useState<{ [url: string]: string }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<string | null>(
    null
  );
  const collectionRef = collection(db, "fileMetadata");

  useEffect(() => {
    const fetchTNImageUrls = async () => {
      try {
        const TNimagesRef = ref(storage, "thumbnails");
        const imageList = await listAll(TNimagesRef);
        const urlsPromises = imageList.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          return url;
        });
        const urls = await Promise.all(urlsPromises); //takes an array of promises as its argument and returns a new promise. This new promise will be fulfilled when all the promises in the input array have been fulfilled or rejected

        // Fetch metadata from Firestore
        const metaData = await getDocs(collectionRef);
        const userData = metaData.docs.map((doc) => {
          return doc.data();
        });

        // Create a dictionary to store uploader information based on URL
        const imageDataDict: { [url: string]: string } = {};
        urls.forEach((url, index) => {
          imageDataDict[url] = userData[index].uploader || "";
        });

        setImageData(imageDataDict);

        console.log("Image Data: ", imageDataDict);
      } catch (error) {
        console.error("Error fetching thumbnail image URLs:", error);
      }
    };

    if (auth.currentUser) {
      fetchTNImageUrls();
    }
  }, []);

  const handleImageClick = (url: string) => {
    setSelectedImageIndex(url);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  /*   Object entries transforms imageData to an array of key-valuepairs (entries) so the every key value pair represents an image(url) and the uploader of the image */
  return (
    <div>
      <UploadForm />
      <h2>Photo Gallery</h2>
      <div className="image-container">
        {Object.entries(imageData)
          .reverse()
          .map(([url, uploader], index) => (
            <div key={url} className="thumbnail-container">
              <img
                src={url}
                alt={`Thumbnail ${index}`}
                onClick={() => handleImageClick(url)}
              />
              {uploader && <p>Uploader: {uploader}</p>}
            </div>
          ))}
      </div>

      {/* lightbox to display the larger image */}
      {selectedImageIndex !== null && (
        <div className="modal">
          <button onClick={handleCloseModal}>Close</button>
          <img src={selectedImageIndex} alt="Selected Image" />
        </div>
      )}
    </div>
  );
};

export default PhotoDisplay;
