import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";

export const depositFunds = async (client: MarginfiClient, marginfiAccount: any, bank: any, depositAmount: number) => {
    try {
        if (!marginfiAccount) throw new Error("MarginfiAccount is undefined");
        if (!bank?.address) throw new Error("Bank Address (PublicKey) is undefined");

        console.log(`Depositing ${depositAmount} SOL into bank ${bank.address.toBase58()}`);
        await marginfiAccount.deposit(depositAmount, bank.address);
        console.log(`Deposited ${depositAmount} SOL into bank ${bank.address.toBase58()}`);
    } catch (error) {
        console.error("Error depositing funds:", error);
        throw error;
    }
};
