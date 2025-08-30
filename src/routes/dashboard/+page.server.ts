import type {PageServerLoad} from './$types';
import {calculateOwnership} from '$lib/server/ownership';
import { getUserData } from '$lib/server/user';
import { getMarketData } from '$lib/server/market';

export const load: PageServerLoad = async ({ locals }) => {
    const ownership = await calculateOwnership(locals.user?.id || '');
    const userData = await getUserData(locals.user?.id || '');
    const marketData = await getMarketData();
    return {
        ownership,
        balance: userData.balance,
        monetaryInvestment: userData.monetaryInvestment,
        sweatInvestment: userData.sweatInvestment,
        market: {
            balance: marketData.balance
        }
    };
}