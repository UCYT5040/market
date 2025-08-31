import { Query } from "node-appwrite";
import { collections, incrementDocumentAttribute, listDocuments } from "./database";
import { calculateOwnership } from "./ownership";

export async function processDividends() {
    let totalProfits = 0;

    // Find all sales with dividendPaid as false
    const sales = await listDocuments(collections.sales, [
        Query.equal('dividendPaid', false)
    ]);

    for (const sale of sales) {
        totalProfits += sale.profit;
    }

    // Distribute profits to shareholders
    const users = await listDocuments(collections.users, [
        Query.or([
            Query.greaterThan('monetaryInvestment', 0),
            Query.greaterThan('sweatInvestment', 0)
        ])
    ]);

    for (const user of users) {
        const ownership = await calculateOwnership(user.userId);
        const share = ownership * totalProfits;
        // Increment user's balance
        await incrementDocumentAttribute(collections.users, user.$id, 'balance', share);
    }

    // Mark all processed sales as dividendPaid
    for (const sale of sales) {
        await incrementDocumentAttribute(collections.sales, sale.$id, 'dividendPaid', true);
    }
}