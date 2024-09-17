import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";

export const checkCollateral = async (client: MarginfiClient, marginfiAccount: any, bank: any) => {
    try {
        const balance = await marginfiAccount.getBalance(bank.address);
        console.log(`Account balance for ${bank.tokenSymbol}:`, balance);
        if (balance.assetShares.lte(0)) {
            throw new Error("Insufficient collateral for borrowing");
        }
    } catch (error) {
        console.error("Error checking collateral:", error);
        throw error;
    }
};
