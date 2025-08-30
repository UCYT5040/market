import {
	APPWRITE_COLLECTION_ID_USERS,
	APPWRITE_DATABASE_ID,
	APPWRITE_COLLECTION_ID_PRODUCTS,
	APPWRITE_COLLECTION_ID_PURCHASE_REPORTS,
	APPWRITE_COLLECTION_ID_MARKET,
	APPWRITE_COLLECTION_ID_MONETARY_INVESTMENTS,
	APPWRITE_COLLECTION_ID_SWEAT_REPORTS,
	APPWRITE_COLLECTION_ID_REPORT_ATTACHMENTS,
	APPWRITE_COLLECTION_ID_CUSTOMERS,
	APPWRITE_COLLECTION_ID_ADMIN_ADJUSTMENTS
} from '$env/static/private';
import { serverClient } from '$lib/server/appwrite';
import { Databases, Query } from 'node-appwrite';

export const databases = new Databases(serverClient);

export async function getDatabase() {
	try {
		return await databases.get(APPWRITE_DATABASE_ID);
	} catch (error) {
		console.error('Error fetching database:', error);
		throw new Error('Failed to fetch database');
	}
}

export const databaseId = APPWRITE_DATABASE_ID;

export const collections = {
	users: APPWRITE_COLLECTION_ID_USERS,
	products: APPWRITE_COLLECTION_ID_PRODUCTS,
	purchaseReports: APPWRITE_COLLECTION_ID_PURCHASE_REPORTS,
	reportAttachments: APPWRITE_COLLECTION_ID_REPORT_ATTACHMENTS,
	market: APPWRITE_COLLECTION_ID_MARKET,
	monetaryInvestments: APPWRITE_COLLECTION_ID_MONETARY_INVESTMENTS,
	sweatReports: APPWRITE_COLLECTION_ID_SWEAT_REPORTS,
	customers: APPWRITE_COLLECTION_ID_CUSTOMERS,
	adminAdjustments: APPWRITE_COLLECTION_ID_ADMIN_ADJUSTMENTS
};

// TODO: type the queries parameter
export async function getDocument(
	collectionId: string,
	documentId: string,
	queries: string[] = []
) {
	try {
		const result = await databases.getDocument(databaseId, collectionId, documentId, queries);
		if (!result) {
			throw new Error('Document not found');
		}
		return result;
	} catch (error) {
		console.error(`Error fetching document ${documentId} from collection ${collectionId}:`, error);
		throw new Error('Failed to fetch document');
	}
}

export async function listDocuments(collectionId: string, queries: string[] = []) {
	try {
		const result = await databases.listDocuments(databaseId, collectionId, queries);
		return result.documents;
	} catch (error) {
		console.error(`Error listing documents from collection ${collectionId}:`, error);
		throw new Error('Failed to list documents');
	}
}

export async function getFirstDocument(collectionId: string, queries: string[] = []) {
	try {
		queries.push(Query.limit(1)); // Limit to 1 document
		const result = await databases.listDocuments(databaseId, collectionId, queries);
		if (result.total === 0) {
			throw new Error('No documents found');
		}
		return result.documents[0];
	} catch (error) {
		console.error(`Error fetching first document from collection ${collectionId}:`, error);
		throw new Error('Failed to fetch first document');
	}
}

export async function createDocument(collectionId: string, data: object) {
	try {
		return await databases.createDocument(
			databaseId,
			collectionId,
			'unique()', // Use unique ID for the document
			data
		);
	} catch (error) {
		console.error(`Error creating document in collection ${collectionId}:`, error);
		throw new Error('Failed to create document');
	}
}

export async function updateDocument(collectionId: string, documentId: string, data: object) {
	try {
		return await databases.updateDocument(databaseId, collectionId, documentId, data);
	} catch (error) {
		console.error(`Error updating document ${documentId} in collection ${collectionId}:`, error);
		throw new Error('Failed to update document');
	}
}

export async function incrementDocumentAttribute(
	collectionId: string,
	documentId: string,
	attribute: string,
	increment: number,
	max: number | undefined = undefined
) {
	try {
		return await databases.incrementDocumentAttribute(
			databaseId,
			collectionId,
			documentId,
			attribute,
			increment,
			max
		);
	} catch (error) {
		console.error(
			`Error incrementing attribute ${attribute} in document ${documentId} of collection ${collectionId}:`,
			error
		);
		throw new Error('Failed to increment document attribute');
	}
}

export async function decrementDocumentAttribute(
	collectionId: string,
	documentId: string,
	attribute: string,
	decrement: number,
	min: number | undefined = undefined
) {
	try {
		return await databases.decrementDocumentAttribute(
			databaseId,
			collectionId,
			documentId,
			attribute,
			decrement,
			min
		);
	} catch (error) {
		console.error(
			`Error decrementing attribute ${attribute} in document ${documentId} of collection ${collectionId}:`,
			error
		);
		throw new Error('Failed to decrement document attribute');
	}
}
