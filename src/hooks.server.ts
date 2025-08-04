import { createUserClient } from '$lib/server/appwrite';
import {Account} from 'node-appwrite';

export async function handle({ event, resolve }) {
    try {
        const client = createUserClient();
        client.setSession(event.cookies.get('session') || '');
        const account = new Account(client);
        event.locals.user = await account.get();
    } catch (error) {
        console.error('Error fetching user account:', error);
        event.locals.user = undefined;
    }

    return resolve(event);
}
