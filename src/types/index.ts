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

export type UpdateProfileData = {
    displayName: string,
    photoFile: FileList,
    email: string,
    password: string,
    confirmPassword: string,
    photoURL: string
}