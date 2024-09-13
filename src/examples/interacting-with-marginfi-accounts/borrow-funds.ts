import { fetchBank } from "./fetch-bank";

/**
 * Step 3: Borrow Funds from a Marginfi Bank
 * Returns the bank address from which funds were borrowed.
 */
export const borrowFunds = async (client: any, marginfiAccount: any) => {
    // Fetch bank
    const bank = await fetchBank(client); // Pass the client to fetchBank as well
    if (!bank) throw new Error("Bank not found for symbol: SOL");

    // Borrow funds from the bank
    await marginfiAccount.borrow(1, bank.address);
    console.log("Borrowed 1 SOL from the bank.");

    // Return the bank address
    return bank.address.toString();
};
