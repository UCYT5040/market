import { Query } from 'node-appwrite';
import { collections, listDocuments } from './database';
import { getUserData } from './user';

export function valueSweat(units: number) {
    // Federal minimum wage
    return units * 7.25;
}

export function normalizeShare(value: number) {
    // Round to the 4th decimal place
    return Math.round(value * 10000) / 10000;
}

export async function calculateOwnership(userId: string) {
	// Get investments for all users (and find this user's investments as well)

	const allUsers = await listDocuments(collections.users, [
		Query.select(['monetaryInvestment', 'sweatInvestment'])
	]);

	let totalMonetaryInvestments = 0;
	let totalSweatInvestments = 0;


	for (const user of allUsers) {
		totalMonetaryInvestments += user.monetaryInvestment || 0;
		totalSweatInvestments += user.sweatInvestment || 0;
	}

	const userData = await getUserData(userId);

	const userMonetaryInvestment = userData.monetaryInvestment || 0;
	const userSweatInvestment = userData.sweatInvestment || 0;

    const totalValue = totalMonetaryInvestments + valueSweat(totalSweatInvestments);
    const userValue = userMonetaryInvestment + valueSweat(userSweatInvestment);

    return normalizeShare(userValue / totalValue);
}
