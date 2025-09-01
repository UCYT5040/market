import {serverClient} from '$lib/server/appwrite';
import {Account, Query, Users} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {collections, createDocument, updateDocument} from '$lib/server/database';
import {normalizeUPC} from '$lib/upc';
import {manageProduct} from '$lib/server/productManagement';

const users = new Users(serverClient);

export const load: PageServerLoad = async ({ locals }) => {
    const userList = await users.list();

    // Manually ensure labels do not contain 'approved' (Appwrite has no "does not contain" query)
    const filteredUsers = userList.users.filter(user => !user.labels.includes("approved"));

    return {
        users: filteredUsers
    };
};

export const actions = {
    default: async ({request}) => {
        const formData = await request.formData();
        const userId = formData.get("userId") as string;
        
        const user = await users.get(userId);

        const newLabels = [
            'approved',
            ...user.labels.filter(label => label !== 'approved')
        ]

        const result = await users.updateLabels(
            userId,
            newLabels
        );

        if (result) {
            return {
                status: 200,
                body: {
                    message: 'User approved successfully'
                }
            };
        } else {
            return fail(500, {
                message: 'Failed to approve user'
            });
        }
    }
} satisfies Actions;