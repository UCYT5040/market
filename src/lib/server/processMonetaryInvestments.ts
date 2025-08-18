import { Query, Users } from 'node-appwrite';
import { collections, incrementDocumentAttribute, listDocuments, updateDocument } from './database';
import { serverClient } from './appwrite';
import { getUserData } from './user';
import { updated } from '$app/state';

function getLastMidnight() {
    // TODO: Support different timezones
	// Get the current date and time in Chicago timezone
	const now = new Date();

	// Format the current date in Chicago timezone as YYYY-MM-DD
	const chicagoDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });

	// Create a Date object for midnight in Chicago, then convert to UTC
	// We'll create the date as Chicago midnight and manually convert
	const chicagoMidnight = new Date(chicagoDateStr + 'T00:00:00');

	// Get what time it is right now in Chicago to determine the offset
	const nowInChicago = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
	const nowInUTC = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));

	// Calculate the offset between Chicago and UTC (in milliseconds)
	const offsetMs = nowInUTC.getTime() - nowInChicago.getTime();

	// Apply the offset to convert Chicago midnight to UTC midnight
	return new Date(chicagoMidnight.getTime() + offsetMs);
}

export async function processMonetaryInvestments() {
	const investments = await listDocuments(collections.monetaryInvestments, [
		Query.equal('cause', 'manual'), // Automatic investments are applied immediatly
		Query.equal('processed', false)
		// Query.lessThan("$createdAt", getLastMidnight().getTime()) (seems to be unsupported by Appwrite)
	]);

	// Process each investment
	for (const investment of investments) {
		// Manually check that $createdAt (an ISO 8601 string) is less than the last midnight
		if (new Date(investment.$createdAt) >= getLastMidnight()) {
			continue;
		}

		const userData = await getUserData(investment.user);

		await updateDocument(collections.monetaryInvestments, investment.$id, {
			processed: true
		});

		const result = await incrementDocumentAttribute(collections.users, userData.$id, 'monetaryInvestment', investment.amount);
	}
}
