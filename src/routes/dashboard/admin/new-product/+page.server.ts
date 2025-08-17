import {serverClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {collections, createDocument} from '$lib/server/database';
import {normalizeUPC} from '$lib/upc';
import {manageProduct} from '$lib/server/productManagement';


export const actions = {
    default: async ({request, locals}) => {
        if (!locals.user || !locals.user.admin) {
            return fail(403, {
                success: false,
                message: 'You must be logged in and have admin privileges to create products.'
            });
        }

        return await manageProduct(request, 'create');
    }
} satisfies Actions;
