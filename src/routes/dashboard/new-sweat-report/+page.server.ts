import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {getLocationTaxRates} from '$lib/server/ilTaxes';
import {collections, createDocument, getDocument} from '$lib/server/database';
import {normalizePrice} from '$lib/price';

export const actions = {
    default: async ({request, locals}) => {
        const formData = await request.formData();
        const reason = formData.get('reason') as string;
        const amount = parseFloat(formData.get('amount') as string);

        if (!amount || isNaN(amount) || amount <= 0) {
            return fail(400, {
                success: false,
                message: 'Invalid amount specified.'
            });
        }

        if (!reason || reason.length > 4096) {
            return fail(400, {
                success: false,
                message: 'Invalid reason specified.'
            });
        }

        const result = await createDocument(
            collections.sweatReports, {
                user: locals.user?.id,
                reason,
                amount
            }
        );

        if (!result) {
            return fail(500, {
                success: false,
                message: 'Failed to create sweat report.'
            });
        }

        return redirect(303, `/dashboard/sweat-report/${result.$id}`); // Redirect to the newly created report
    }
} satisfies Actions;
