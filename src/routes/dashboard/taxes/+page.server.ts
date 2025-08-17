import {redirect} from '@sveltejs/kit';
import {getLocationTaxRates} from '$lib/server/ilTaxes';
import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async () => {
    return {
        taxRates: getLocationTaxRates()
    };
};