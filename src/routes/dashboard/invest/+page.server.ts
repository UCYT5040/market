import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserData } from '$lib/server/user';
import { collections, createDocument, decrementDocumentAttribute, incrementDocumentAttribute, updateDocument } from '$lib/server/database';
import { Decimal } from 'decimal.js';
import { normalizePrice } from '$lib/price';
import { getMarketData } from '$lib/server/market';

export const actions = {
	invest: async ({ request, locals }) => {
		const formData = await request.formData();
		const amount = formData.get('amount') as string;

		const floatAmount = parseFloat(amount);

        if (isNaN(floatAmount) || floatAmount <= 0) {
			return fail(400, {
				success: false,
				message: 'Invalid amount'
			});
		}

        const normalAmount = normalizePrice(floatAmount);

        const userData = await getUserData(locals.user?.id || '');

        if (!userData) {
            return fail(404, {
                success: false,
                message: 'User not found'
            });
        }

        const marketData = await getMarketData();

        if (normalAmount < userData.balance) {
            return fail(400, {
                success: false,
                message: `Your balance is insufficient for this investment`
            });
        }

        const decrementResult = await decrementDocumentAttribute(
            collections.users,
            userData.$id,
            'balance',
            normalAmount
        );

        if (!decrementResult) {
            return fail(500, {
                success: false,
                message: 'Failed to update user balance'
            });
        }

        const incrementResult = await incrementDocumentAttribute(
            collections.market,
            marketData.$id,
            'balance',
            normalAmount
        );

        if (!incrementResult) {
            return fail(500, {
                success: false,
                message: 'Failed to update market balance'
            });
        }

        const result = await createDocument(
            collections.monetaryInvestments,
            {
                cause: "manual",
                amount: normalAmount,
                user: locals.user?.id || ''
            }
        )

        if (result) {
            return { success: true, message: 'Investment created successfully' };
        } else {
            return fail(500, {
                success: false,
                message: 'Failed to create investment'
            });
        }
	},
	setAutoInvest: async ({ request, locals }) => {
		const formData = await request.formData();
		const percent = formData.get('percent') as string;

		const normalPercent = parseFloat(percent);

		if (isNaN(normalPercent) || normalPercent < 0 || normalPercent > 100) {
			return fail(400, {
				success: false,
				message: 'Invalid percent value'
			});
		}

		const userData = await getUserData(locals.user?.id || '');

		if (!userData) {
			return fail(500, {
				success: false,
				message: 'Failed to load user data'
			});
		}

		const result = await updateDocument(collections.users, userData.$id, {
			autoInvestDividendPercent: Decimal(normalPercent).div(100).toNumber()
		});

		if (result) {
			return { success: true, message: 'Auto-invest settings updated successfully' };
		} else {
			return fail(500, {
				success: false,
				message: 'Failed to update user data'
			});
		}
	}
} satisfies Actions;

function isNearMidnight() {
	const now = new Date();
	const minutes = now.getMinutes();
	const hours = now.getHours();
	return hours === 23 && minutes >= 45;
}

export const load: PageServerLoad = async ({ locals }) => {
	const userData = await getUserData(locals.user?.id || '');
	if (!userData) {
		return fail(500, {
			success: false,
			message: 'Failed to load user data'
		});
	}
	// If the server time is near midnight (within 15 minutes) show a warning
	const showMidnightWarning = isNearMidnight();
	return {
		autoInvestDividendPercent: userData.autoInvestDividendPercent || 0,
		showMidnightWarning
	};
};
