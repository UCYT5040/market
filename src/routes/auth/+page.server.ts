import {serverClient} from '$lib/server/appwrite';
import {Account} from 'node-appwrite';
import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';

export const load: PageServerLoad = async ({locals}) => {
    if (locals.user) {
        // User is already signed in, redirect to dashboard
        console.log('User is already signed in, redirecting to dashboard');
        return redirect(303, '/dashboard');
    }
};


export const actions = {
    login: async ({request, cookies}) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString().trim();
        if (!email || !password) {
            return fail(400, {
                success: false,
                message: 'Email and password are required.'
            });
        }

        const account = new Account(serverClient); // This may seem dangerous, but is necessary to create the initial
        // session (user clients can be used after login)
        let session;
        try {
            session = await account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error('Login error:', error);
            return fail(400, {
                success: false,
                message: 'Login failed. Please check your credentials.'
            });
        }
        console.log('Session secret: ' + session.secret);
        cookies.set('session', session.secret, {
            sameSite: 'strict',
            expires: new Date(session.expire),
            secure: true, // Debugging only
            path: '/'
        });
        return redirect(303, '/dashboard');
    },
    register: async ({request, cookies}) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString().trim();
        const confirmPassword = formData.get('confirmPassword')?.toString().trim();
        const name = formData.get('name')?.toString().trim();
        if (!email || !password || !confirmPassword || !name) {
            return fail(400, {
                success: false,
                message: 'All fields are required.'
            });
        }
        if (password !== confirmPassword) {
            return fail(400, {
                success: false,
                message: 'Passwords do not match.'
            });
        }
        const account = new Account(serverClient);
        try {
            await account.create('unique()', email, password, name);
        } catch (error) {
            console.error('Registration error:', error);
            return fail(400, {
                success: false,
                message: 'Registration failed. Please try again.'
            });
        }
        // Return success, page will switch to login
        return {
            success: true,
            message: 'registrationSuccess'
        };
    }
} satisfies Actions;
