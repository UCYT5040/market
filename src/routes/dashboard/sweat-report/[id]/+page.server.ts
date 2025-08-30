import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { collections, createDocument, decrementDocumentAttribute, getDocument, incrementDocumentAttribute, listDocuments, updateDocument } from '$lib/server/database';
import { Query, Users } from 'node-appwrite';
import { serverClient } from '$lib/server/appwrite';
import { buckets, createFile } from '$lib/server/storage';
import type { PreviewImage } from '$lib/previewImage';
import { getUserData } from '$lib/server/user';
import { getMarketData } from '$lib/server/market';

export const actions = {
	attachImage: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const file = formData.get('image') as Blob;
		if (!file || !(file instanceof Blob)) {
			console.warn('attachImage action called with invalid file:', file);
			return fail(400, {
				success: false,
				message: 'Invalid file provided.'
			});
		}

		const fileExt = file.type.split('/')[1];

		let result;
		try {
			result = await createFile(
				buckets.approvedUsers,
				file,
				`purchase-report-${params.id}-${Date.now()}.${fileExt}`
			);
		} catch (error) {
			console.error('Failed to upload file:', error);
		}

		if (!result) {
			return fail(500, {
				success: false,
				message: 'Failed to upload file.'
			});
		}

		// Create attachment document
		let attachment;

		try {
			attachment = await createDocument(collections.reportAttachments, {
				report: params.id,
				value: result.$id,
				type: 'image',
				user: locals.user?.id
			});
		} catch (error) {
			console.error('Failed to create attachment document:', error);
		}
		if (!attachment) {
			return fail(500, {
				success: false,
				message: 'Failed to create attachment document.'
			});
		}
		// Return success
		return {
			success: true,
			message: 'File uploaded successfully.'
		};
	},
	attachText: async ({ request, params, locals }) => {
		// Get form data
		const formData = await request.formData();
		const text = formData.get('text') as string;
		if (!text || typeof text !== 'string' || text.trim() === '') {
			console.warn('attachText action called with invalid text:', text);
			return fail(400, {
				success: false,
				message: 'Invalid text provided.'
			});
		}

		// Create attachment document
		let attachment;

		try {
			attachment = await createDocument(collections.reportAttachments, {
				report: params.id,
				value: text,
				type: 'text',
				user: locals.user.id
			});
		} catch (error) {
			console.error('Failed to create attachment document:', error);
		}
		if (!attachment) {
			return fail(500, {
				success: false,
				message: 'Failed to create attachment document.'
			});
		}
		// Return success
		return {
			success: true,
			message: 'Text attached successfully.'
		};
	},
	adminApprove: async ({ params, locals }) => {
		if (!locals.user?.admin) {
			return fail(403, {
				success: false,
				message: 'You do not have permission to approve purchase reports.'
			});
		}

        const report = await getDocument(collections.sweatReports, params.id);

        const userData = await getUserData(locals.user.id);

        const result = await incrementDocumentAttribute(
            collections.users,
            userData.$id,
            'sweatInvestment',
            report.amount
        );

        if (!result) {
			return fail(500, {
				success: false,
				message: 'Failed to update user sweat investment.'
			});
		}

		// Mark this report as "approved"
		try {
			await updateDocument(collections.sweatReports, report.$id, {
				status: 'approved'
			});
		} catch (error) {
			console.error('Failed to update report status:', error);
			return fail(500, {
				success: false,
				message: 'Failed to update report status.'
			});
		}
	},
	adminDeny: async ({ params, locals }) => {
		if (!locals.user?.admin) {
			return fail(403, {
				success: false,
				message: 'You do not have permission to deny purchase reports.'
			});
		}

		// Get report
		const report = await getDocument(collections.sweatReports, params.id);

		// Set status as denied
		try {
			await updateDocument(collections.sweatReports, report.$id, {
				status: 'denied'
			});
		} catch (error) {
			console.error('Failed to update report status:', error);
			return fail(500, {
				success: false,
				message: 'Failed to update report status.'
			});
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ params, locals }) => {
	// TODO: Try/catch all database operations to handle errors gracefully
	// TODO: Either use `report.` or use the spread + object, not both (leaning towards spread + object)
	const report = await getDocument(collections.sweatReports, params.id);

	if (!report) {
		return fail(404, {
			success: false,
			message: 'Sweat report not found.'
		});
	}

	// List the attachments
	const attachments =
		(await listDocuments(collections.reportAttachments, [
			Query.equal('report', report.$id),
			Query.orderAsc('$createdAt')
		])) || [];

	// Get the user who created the report
	const users = new Users(serverClient);
	let username = 'Unknown User';
	try {
		const user = await users.get(report.user);
		username = user.name || 'Unknown User';
	} catch (error) {
		console.error(`Failed to fetch user for report ${report.$id}:`, error);
	}

	// Add images & username for attachments
	for (const attachment of attachments) {
		if (attachment.type === 'image') {
			attachment.image = {
				previewURL: `/api/bucket?file=${attachment.value}&preview=true`,
				imageURL: `/api/bucket?file=${attachment.value}`
			} as PreviewImage;
		}
		const attachmentUser = await users.get(attachment.user);
		attachment.username = attachmentUser.name || 'Unknown User';
	}

	return {
		report: {
			...report,
			username: username,
			attachments: attachments
		}
	};
};
