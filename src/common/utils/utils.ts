import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";
import { Keypair } from "@solana/web3.js";
import * as fs from "fs";

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

export const checkBankOperationalState = (bank: any) => {
    if (bank.config.operationalState !== 'Operational') {
        throw new Error(`Bank ${bank.tokenSymbol} is not operational. Current state: ${bank.config.operationalState}`);
    }
};

// Helper function to load a keypair from a file
export const loadKeypairFromFile = (path: string): Keypair => {
    const secretKey = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
};
