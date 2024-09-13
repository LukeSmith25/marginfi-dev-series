import { PublicKey } from "@solana/web3.js";  // Import PublicKey

// Define your Phantom public key
const PHANTOM_WALLET_PUBLIC_KEY = new PublicKey("FYVCrqZJtMr9rnDPkRxBymCSwvosodcpkrYTebLt9mno");

/**
 * Borrows funds from a bank using your Phantom wallet public key.
 */
export const borrowFunds = async (client: any) => {
    try {
        const bank = await client.getBankByTokenSymbol("SOL");  // Fetch the bank for SOL
        if (!bank) throw new Error("Bank not found for SOL");

        // Perform borrowing using your Phantom wallet public key
        await client.borrow(0.01, bank.address, PHANTOM_WALLET_PUBLIC_KEY);
        console.log("Borrowed 0.01 SOL from the bank:", bank.address.toString());
    } catch (error) {
        console.error("Error borrowing funds:", error);
        throw error;
    }
};
