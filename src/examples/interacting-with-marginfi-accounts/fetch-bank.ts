/**
 * Fetches a bank by its token symbol.
 */
export const fetchBank = async (client: any, tokenSymbol: string) => {
    try {
        const bank = await client.getBankByTokenSymbol(tokenSymbol);
        if (!bank) throw new Error(`Bank not found for symbol: ${tokenSymbol}`);

        console.log("Fetched bank:", bank);
        return bank; // Return the bank object for further use
    } catch (error) {
        console.error("Error fetching bank:", error);
        throw error;
    }
};
