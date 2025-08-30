import { listDocuments, collections } from "$lib/server/database";
import { type RequestHandler, error, json } from "@sveltejs/kit";
import { Query, Users } from "node-appwrite";
import {serverClient} from "$lib/server/appwrite"

const users = new Users(serverClient);

export const GET: RequestHandler = async ({locals, url}) => {
    // Check if the user is logged in
    if (!locals.user) {
        error(401, 'Unauthorized: You must be logged in to access this resource');
    }

    // Require admin access
    // Perhaps this will be lowered to allow approved users access, but is currently only needed by admins
    if (!locals.user.admin) {
        error(403, 'Forbidden: You must be an admin to access this resource');
    }

    const name = url.searchParams.get('name');

    if (!name) {
        error(400, 'Bad Request: You must provide a name');
    }

    const result = await users.list(
        [
            Query.limit(3)
        ],
        name
    );

    if (!result) {
        error(404, 'Not Found: User not found');
    }

    return json({
        users: result
    });
};