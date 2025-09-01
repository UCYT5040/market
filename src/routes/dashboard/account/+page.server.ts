import type { Actions, PageServerLoad } from './$types';
import { calculateOwnership } from '$lib/server/ownership';
import { Account, Users } from 'node-appwrite';
import { getUserClient, serverClient } from '$lib/server/appwrite';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		userData: locals.userData
	};
};

export const actions = {
	logout: async ({ request, locals, cookies }) => {
		const account = new Account(getUserClient(cookies.get('session') || ''));
        console.log("SESSION", cookies.get('session'))
		await account.deleteSession("current");

		cookies.delete('session', {
			path: '/'
		});

		return redirect(303, '/');
	}
} satisfies Actions;
