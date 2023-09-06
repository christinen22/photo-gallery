import { getStorage } from "firebase-admin/storage";
import * as functions from "firebase-functions";
import * as path from "path";
import * as sharp from "sharp";
import * as logger from "firebase-functions/logger";

/**
 * When an image is uploaded in the Storage bucket,
 * generate a thumbnail automatically using sharp.
 */
export const generateThumbnail = functions
    .region("europe-west3")
    .storage.object()
    .onFinalize(async (object) => {
        console.log("Function triggered with event:", object);

        // Extract event attributes
        const fileBucket = object.bucket; // Storage bucket containing the file.
        const filePath = object.name || ""; // File path in the bucket (default empty string).
        const contentType = object.contentType; // File content type.

        // Check if contentType is defined and if it starts with "image/"
        if (!contentType || !contentType.startsWith("image/")) {
            return logger.log("This is not an image.");
        }

        // Exit if the image is already a thumbnail.
        const fileName = path.basename(filePath);
        if (fileName.startsWith("thumb_")) {
            return logger.log("Already a Thumbnail.");
        }

        // Download file into memory from bucket.
        const bucket = getStorage().bucket(fileBucket);
        const downloadResponse = await bucket.file(filePath).download();
        const imageBuffer = downloadResponse[0];
        logger.log("Image downloaded!");

        // Generate a thumbnail using sharp.
        const thumbnailBuffer = await sharp(imageBuffer)
            .resize({
                width: 200,
                height: 200,
                withoutEnlargement: true,
            })
            .toBuffer();
        logger.log("Thumbnail created");

        // Specify a separate folder for thumbnails (e.g., "thumbnails/")
        const thumbnailFolder = "thumbnails/";
        // Prefix 'thumb_' to file name.
        const thumbFileName = `thumb_${fileName}`;
        const thumbFilePath = path.join(thumbnailFolder, thumbFileName);

        // Upload the thumbnail.
        const metadata = { contentType: contentType };
        await bucket.file(thumbFilePath).save(thumbnailBuffer, {
            metadata: metadata,
        });
        return logger.log("Thumbnail uploaded!");
    });
