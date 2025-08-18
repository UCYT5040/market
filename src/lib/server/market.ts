import { collections, createDocument, getFirstDocument } from '$lib/server/database';

export async function getMarketData() {
	try {
		return await getFirstDocument(collections.market, []);
	} catch (error) {
		return await createDocument(collections.market, {
			balance: 0 // We should just pass an empty dict, but for some reason Appwrite does not allow this, so we just pass a balance of zero to avoid that
		});
	}
}
