import {serverClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {collections, createDocument, updateDocument} from '$lib/server/database';
import {normalizeUPC} from '$lib/upc';
import {manageProduct} from '$lib/server/productManagement';


export const actions = {
    default: async ({request, locals}) => {
        return await manageProduct(request, 'create');
    }
} satisfies Actions;
