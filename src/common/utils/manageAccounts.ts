import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";

export const manageAccounts = async (client: MarginfiClient, marginfiAccount: any, bank: any) => {
    try {
        if (!bank || !bank.address) throw new Error("Bank or Bank Address (PublicKey) is undefined");

        const balance = await marginfiAccount.getBalance(bank.address);
        console.log("Updated account balance:", balance);
        return balance;
    } catch (error) {
        console.error("Error managing account:", error);
        throw error;
    }
};
