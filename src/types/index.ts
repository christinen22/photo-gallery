import { Timestamp } from "firebase/firestore"

export type Photo = {
    userId: string,
    imageUrl: string,
    timestamp: Timestamp
}

export type RegisterCredentials = {
    email: string,
    username: string,
    password: string,
    passwordConfirm: string
}