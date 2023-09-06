import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (if needed)
admin.initializeApp();

// Import and export your Firebase Functions
export { generateThumbnail } from './generateThumbnail'
