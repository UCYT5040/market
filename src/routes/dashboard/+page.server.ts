import type {PageServerLoad} from './$types';
import {calculateOwnership} from '$lib/server/ownership';
import { getUserData } from '$lib/server/user';
import { getMarketData } from '$lib/server/market';
import { collections, listDocuments } from '$lib/server/database';
import { Query } from 'node-appwrite';
import { round } from '$lib/round';

export const load: PageServerLoad = async ({ locals }) => {
    const ownership = await calculateOwnership(locals.user?.id || '');
    const userData = await getUserData(locals.user?.id || '');
    const marketData = await getMarketData();

    // Find all sales within the last 7 days
    const recentSales = await listDocuments(collections.sales, [
        Query.greaterThan('$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    ])

    let salesPerformance = 0;
    let totalSales = 0;

    for (const sale of recentSales) {
        if (sale.user === locals.user?.id) {
            salesPerformance++;
        }
        totalSales++;
    }

    return {
        ownership,
        balance: userData.balance,
        monetaryInvestment: userData.monetaryInvestment,
        sweatInvestment: userData.sweatInvestment,
        market: {
            balance: marketData.balance
        },
        salesPerformance: {
            count: salesPerformance,
            topPercent: totalSales > 0 ? round(salesPerformance / totalSales) * 100 : 0
        }
    };
}