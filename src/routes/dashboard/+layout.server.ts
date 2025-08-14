import type {LayoutServerLoad} from '../../../.svelte-kit/types/src/routes/dashboard/$types';
import {redirect} from '@sveltejs/kit';


export const load: LayoutServerLoad = async ({locals}) => {
    if (!locals.user) {
        console.log('No session found, redirecting to auth...');
        return redirect(302, '/auth');
    }
    // Ensure the user has the `approved` label
    if (!locals.user.labels || !locals.user.labels.includes('approved')) {
        return redirect(302, '/approval');
    }
    console.log('User account fetched successfully:', locals.user.labels);
    return {
        admin: locals.user.labels.includes('admin'),
        userName: locals.user.name || 'User',
    };
};
