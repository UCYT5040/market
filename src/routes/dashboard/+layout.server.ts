import type {LayoutServerLoad} from '../../../.svelte-kit/types/src/routes/dashboard/$types';
import {redirect} from '@sveltejs/kit';


export const load: LayoutServerLoad = async ({locals}) => {
    if (!locals.user) {
        console.log('No session found, redirecting to auth...');
        return redirect(302, '/auth');
    }
    // Ensure the user has the `approved` label
    if (!locals.user.approved) {
        return redirect(302, '/approval');
    }
    return {
        admin: locals.user.admin,
        userName: locals.user.name || 'User',
    };
};
