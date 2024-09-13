import { fetchBank } from "./fetch-bank";

/**
 * Borrows funds from a bank.
 */
export const borrowFunds = async (client: any, marginfiAccount: any) => {
    try {
        const bank = await fetchBank(client, "SOL"); // Fetch the bank for SOL
        const borrowAmount = 0.05; // Using 0.05 SOL for borrowing
        await marginfiAccount.borrow(borrowAmount, bank.address);
        console.log(`Borrowed ${borrowAmount} SOL from the bank:`, bank.address.toString());
        return bank.address; // Return bank address for further use
    } catch (error) {
        console.error("Error borrowing funds:", error);
        throw error;
    }
};
