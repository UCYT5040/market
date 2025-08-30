import { collections, createDocument, decrementDocumentAttribute, incrementDocumentAttribute, updateDocument } from '$lib/server/database';
import { getUserData } from '$lib/server/user';
import Decimal from 'decimal.js';
import type { Actions } from './$types';

async function incrementDecrementAttribute(user: string, attribute: string, value: number) {
	if (value > 0) {
		await incrementDocumentAttribute(collections.users, user, attribute, value);
	} else {
		await decrementDocumentAttribute(collections.users, user, attribute, Math.abs(value));
	}
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const reason = formData.get('reason') as string;
        const user = formData.get('user') as string;
		// For no change, value is 0 or null
		const balance = formData.get('balance') as string;
		const investment = formData.get('investment') as string;
		const sweatInvestment = formData.get('sweatInvestment') as string;
		// For no change, value is -1 or null
		const commissionRate = formData.get('commissionRate') as string;

		// Get user data
		const userData = await getUserData(user);

		// Peform increments / decrements
		const numericBalance = parseFloat(balance);
		if (numericBalance) {
			await incrementDecrementAttribute(
				userData.$id,
				"balance",
				numericBalance
			);
		}

		const numericInvestment = parseFloat(investment);
		if (numericInvestment) {
			await incrementDecrementAttribute(
				userData.$id,
				"monetaryInvestment",
				numericInvestment
			);
		}

		const numericSweatInvestment = parseFloat(sweatInvestment);
		if (numericSweatInvestment) {
			await incrementDecrementAttribute(
				userData.$id,
				"sweatInvestment",
				numericSweatInvestment
			);
		}

		const numericCommissionRate = parseFloat(commissionRate);
		if (numericCommissionRate && numericCommissionRate !== -1) {
			await updateDocument(collections.users, userData.$id, {
				commissionRate: Decimal(numericCommissionRate).div(100).toNumber()
			});
		}

		// Create an admin adjustment for future reconciliation & logging
		await createDocument(
			collections.adminAdjustments,
			{
				user: userData.$id,
				reason,
				balanceChange: numericBalance,
				investmentChange: numericInvestment,
				sweatChange: numericSweatInvestment,
				newCommission: numericCommissionRate
			}
		)
	}
} satisfies Actions;
