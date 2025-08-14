import type { LayoutServerLoad } from './$types';
import {redirect} from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent }) => {
    const parentData = await parent();

    if (!parentData.admin) {
        redirect(302, '/dashboard');
    }
};