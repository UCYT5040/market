import type {PageServerLoad} from './$types';
import {calculateOwnership} from '$lib/server/ownership';

export const load: PageServerLoad = async ({ locals }) => {
    return {
        userData: locals.userData
    }
}