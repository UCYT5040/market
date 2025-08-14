import {serverClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';

export const load: PageServerLoad = async ({locals}) => {
    if (locals.user) {
        if (locals.user.labels && locals.user.labels.includes('approved')) {
            // User is approved, redirect to dashboard
            console.log('User is approved, redirecting to dashboard');
            return redirect(303, '/dashboard');
        }
    } else {
        // User is not signed in, send to auth page
        console.log('User is not signed in, redirecting to auth');
        return redirect(303, '/auth');
    }
};
