import { PublicKey } from "@solana/web3.js";  // Import PublicKey

// Define your Phantom public key
const PHANTOM_WALLET_PUBLIC_KEY = new PublicKey("FYVCrqZJtMr9rnDPkRxBymCSwvosodcpkrYTebLt9mno");

/**
 * Creates a new Marginfi account and fetches accounts by authority.
 */
export const createFetchAccounts = async (client: any) => {
    try {
        // Check for existing Marginfi accounts associated with Phantom wallet
        const existingAccounts = await client.getMarginfiAccountsForAuthority(PHANTOM_WALLET_PUBLIC_KEY);

        if (existingAccounts.length > 0) {
            console.log("Fetched existing accounts for Phantom wallet:", existingAccounts);
            return { marginfiAccount: null, accounts: existingAccounts };  // Return existing accounts
        }

        // If no accounts exist, create a new Marginfi account
        const marginfiAccount = await client.createMarginfiAccount();
        console.log("Created new Marginfi account:", marginfiAccount.publicKey.toString());

        // Fetch newly created account associated with the Phantom wallet
        const accounts = await client.getMarginfiAccountsForAuthority(PHANTOM_WALLET_PUBLIC_KEY);
        console.log("Fetched accounts:", accounts);

        return { marginfiAccount, accounts };  // Return new account and accounts list
    } catch (error) {
        console.error("Error creating and fetching accounts:", error);
        throw error;
    }
};
