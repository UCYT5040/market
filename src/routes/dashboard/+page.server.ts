import type {PageServerLoad} from './$types';
import {calculateOwnership} from '$lib/server/ownership';

export const load: PageServerLoad = async ({ locals }) => {
    const ownership = await calculateOwnership(locals.user?.$id || '');
    return {
        ownership
    }
}