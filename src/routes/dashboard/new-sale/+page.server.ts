import type {Actions, PageServerLoad} from './$types';
import {fail, redirect} from '@sveltejs/kit';
import {getLocationTaxRates} from '$lib/server/ilTaxes';
import {collections, createDocument, decrementDocumentAttribute, getDocument, incrementDocumentAttribute} from '$lib/server/database';
import {normalizePrice} from '$lib/price';
import { getUserData } from '$lib/server/user';
import { calculateOwnership } from '$lib/server/ownership';
import { round } from '$lib/round';

export const load: PageServerLoad = async ({locals}) => {
    const userData = await getUserData(locals.user?.id || "");

    return {
        commissionRate: userData.commissionRate,
        ownership: await calculateOwnership(locals.user?.id || "")
    }
};

export const actions = {
    default: async ({request, locals}) => {
        const formData = await request.formData();
        const customerId = formData.get("customerId") as string;
        const products = formData.get("products") as string;
        const customerPaidString = formData.get("customerPaid") as string;
        const customerPaid = normalizePrice(parseFloat(customerPaidString));
        const pricingType = formData.get("pricingType") as string;
        // totalPrice is an additional piece of data; do not get unless pricing type is "total"

        // Get commission rate of salesperson
        const userData = await getUserData(locals.user?.id || "");
        const commissionRate = userData.commissionRate;

        const productData: {
            name: string;
            id: string;
            price: number;
            minPrice?: number;
            localPrice: number;
            quantity: number;
        }[] = JSON.parse(products);

        let total = 0;
        if (pricingType === "total") {
            const totalPrice = formData.get("totalPrice") as string;
            total = normalizePrice(parseFloat(totalPrice));
        } else {
            // Determine total based on the `price` keys of the products
            total = productData.reduce((sum, product) => sum + product.price, 0);
        }
        total = round(total);

        // Determine the total cost of the products
        let totalCost = 0;
        for (const product of productData) {
            const realProductData = await getDocument(collections.products, product.id); // TODO: Improve naming
            totalCost += (realProductData?.localPrice || 0) * product.quantity;
        }
        totalCost = round(totalCost);

        const profit = round(total - totalCost);

        const commission = round(profit * commissionRate);

        // Determine how much the customer owes, then increment/decrement their balance accordingly
        const customerOwes = round(total - customerPaid);
        if (customerOwes > 0) {
            // Customer owes money
            await decrementDocumentAttribute(collections.customers, customerId, "balance", customerOwes);
        } else if (customerOwes !== 0) {
            // Customer has overpaid
            await incrementDocumentAttribute(collections.customers, customerId, "balance", -customerOwes);
        }

        // Increment the user by their commission, but then decrement them the amount the customer paid
        await incrementDocumentAttribute(collections.users, userData.$id, "balance", commission);
        await decrementDocumentAttribute(collections.users, userData.$id, "balance", customerPaid);
    
        // Create the sale
        const sale = await createDocument(
            collections.sales,
            {
                customerPaid,
                total,
                profit,
                commission,
                user: locals.user?.id || "",
                customer: customerId
            }
        );

        return {
            success: true,
            sale
        };
    }
} satisfies Actions;
