import type { PageServerLoad } from "./$types";
import {listDocuments, collections} from "$lib/server/database";

export const load: PageServerLoad = async ({ params, locals }) => {
    const products = await listDocuments(collections.products);
    return { products };
};