// env.d.ts

import type { Models } from "node-appwrite";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: {
                approved: boolean,
                admin: boolean,
                name: string,
                id: string
            } | undefined;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
