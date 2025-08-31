import { createUserClient } from '$lib/server/appwrite';
import { Account } from 'node-appwrite';
import { getUserData } from '$lib/server/user';
import { CronJob } from 'cron';
import { processMonetaryInvestments } from '$lib/server/processMonetaryInvestments';
import type { ServerInit } from '@sveltejs/kit';
import { processDividends } from '$lib/server/processDividends';

export async function handle({ event, resolve }) {
	try {
		const client = createUserClient();
		client.setSession(event.cookies.get('session') || '');
		const account = new Account(client);
		const user = await account.get();
		// event.locals.userData = await getUserData(event.locals.user.$id);
		event.locals.user = {
			approved: user.labels.includes('approved'),
			admin: user.labels.includes('admin'),
			name: user.name,
			id: user.$id
		};
	} catch (error) {
		console.error('Error fetching user account:', error);
		event.locals.user = undefined;
	}

	// Require auth & approval on /dashboard endpoints
	if (
		event.url.pathname.startsWith('/dashboard') &&
		(!event.locals.user || !event.locals.user.approved)
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Require admin on /dashboard/admin endpoints
	if (
		event.url.pathname.startsWith('/dashboard/admin') &&
		(!event.locals.user || !event.locals.user.admin)
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	return resolve(event);
}

export const init: ServerInit = () => {
	const job = new CronJob(
		'0 0 * * *', // Runs at midnight daily
		async function () {
			await processDividends();
			await processMonetaryInvestments();
		},
		null,
		true,
		'America/Chicago'
	);
	processMonetaryInvestments();
};
