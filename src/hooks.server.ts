import {createUserClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import {getUserData} from '$lib/server/user';

export async function handle({ event, resolve }) {
    try {
        const client = createUserClient();
        client.setSession(event.cookies.get('session') || '');
        const account = new Account(client);
        const user = await account.get();
        // event.locals.userData = await getUserData(event.locals.user.$id);
        event.locals.user = {
            approved: user.labels.includes("approved"),
            admin: user.labels.includes("admin"),
            name: user.name,
            id: user.$id
        };
    } catch (error) {
        console.error('Error fetching user account:', error);
        event.locals.user = undefined;
    }

    return resolve(event);
}
