import { Client, Account, Databases } from 'node-appwrite';
import {
    PUBLIC_APPWRITE_ENDPOINT,
    PUBLIC_APPWRITE_PROJECT_ID
} from '$env/static/public';
import { APPWRITE_API_KEY } from '$env/static/private';

export const serverClient = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

export function getUserClient(session: string) {
    return new Client()
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID)
        .setSession(session);
}

export function createUserClient() {
    return new Client()
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID);
}
