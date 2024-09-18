import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";
import { Connection } from "@solana/web3.js";
import { checkBankOperationalState, checkCollateral } from "./utils";

export const borrowFunds = async (client: MarginfiClient, marginfiAccount: any, bank: any, connection: Connection) => {
    try {
        const borrowAmount = 0.0001;

        if (!marginfiAccount) throw new Error("MarginfiAccount is undefined");
        if (!bank?.address) throw new Error("Bank Address (PublicKey) is undefined");

        console.log(`Attempting to borrow ${borrowAmount} SOL from bank ${bank.address.toBase58()}`);

        await checkCollateral(client, marginfiAccount, bank);
        checkBankOperationalState(bank);

        await marginfiAccount.borrow(borrowAmount, bank.address);
        console.log(`Borrowed ${borrowAmount} SOL from bank ${bank.address.toBase58()}`);
    } catch (error) {
        console.error("Error borrowing funds:", error);
        throw error;
    }
};
