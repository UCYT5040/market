import {collections, createDocument, getFirstDocument} from '$lib/server/database';
import {Query} from 'node-appwrite';

export async function getUserData(userId: string) {
    try {
        return await getFirstDocument(collections.users, [
            Query.equal('userId', userId)
        ]);
    } catch (error) {
        return await createDocument(collections.users, {
            userId: userId
        });
    }
}