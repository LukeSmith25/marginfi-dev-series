import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";

export const fetchBank = async (client: MarginfiClient, tokenSymbol: string) => {
    try {
        const bank = client.getBankByTokenSymbol(tokenSymbol);
        if (!bank) throw new Error(`Bank not found for symbol: ${tokenSymbol}`);

        console.log("Fetched bank:", bank);
        console.log("Bank Address (PublicKey):", bank.address?.toBase58());

        return bank;
    } catch (error) {
        console.error("Error fetching bank:", error);
        throw error;
    }
};
