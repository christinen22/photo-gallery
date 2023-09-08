import { Timestamp } from "firebase/firestore"

export type Photo = {
    userId: string,
    imageUrl: string,
    timestamp: Timestamp
}