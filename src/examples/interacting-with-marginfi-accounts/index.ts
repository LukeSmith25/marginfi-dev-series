import { Connection, Keypair } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";
import * as fs from "fs";
import * as os from "os"; // For resolving the home directory
import * as dotenv from "dotenv"; // To load .env file
import { Environment } from "@mrgnlabs/marginfi-client-v2";

// Load environment variables from .env file
dotenv.config();

// Use environment variables for configuration
const clusterUrl = process.env.MARGINFI_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const walletPath = process.env.MARGINFI_WALLET || `${os.homedir()}/solana-wallets/my-wallet/my-wallet.json`;
const environment: Environment = process.env.MARGINFI_ENV as Environment || "production"; // Set to production

// Helper function to load keypair from a file
const loadKeypairFromFile = (path: string): Keypair => {
    const secretKey = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
};

/**
 * Initializes the Marginfi client with the configured environment.
 * @returns {Promise<MarginfiClient>} - Returns the initialized Marginfi client
 */
const initializeClient = async (): Promise<MarginfiClient> => {
    const connection = new Connection(clusterUrl, "confirmed");

    // Load the keypair manually from the correct wallet file
    const walletKeypair = loadKeypairFromFile(walletPath);
    const wallet = new NodeWallet(walletKeypair);

    const config = getConfig(environment);
    return await MarginfiClient.fetch(config, wallet, connection);
};

// Fetches a bank by its token symbol
const fetchBank = async (client: MarginfiClient, tokenSymbol: string) => {
    try {
        const bank = client.getBankByTokenSymbol(tokenSymbol);
        if (!bank) throw new Error(`Bank not found for symbol: ${tokenSymbol}`);
        console.log("Fetched bank:", bank);
        return bank;
    } catch (error) {
        console.error("Error fetching bank:", error);
        throw error;
    }
};

// Borrows funds from a bank
const borrowFunds = async (client: MarginfiClient, marginfiAccount: any, bank: any) => {
    try {
        const borrowAmount = 0.001;  // 0.001 SOL

        // Ensure marginfiAccount has a proper borrow method and pass the bank's public key.
        await marginfiAccount.borrow(borrowAmount, bank.publicKey);
        console.log(`Borrowed ${borrowAmount} SOL from bank ${bank.publicKey.toString()}`);
    } catch (error) {
        console.error("Error borrowing funds:", error);
        throw error;
    }
};

// Creates and fetches Marginfi accounts
const createFetchAccounts = async (client: MarginfiClient) => {
    try {
        const accounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
        if (accounts.length > 0) {
            console.log("Found existing accounts:", accounts);
            return { marginfiAccount: accounts[0], accounts };
        }
        const marginfiAccount = await client.createMarginfiAccount();
        console.log("Created new Marginfi account:", marginfiAccount.address?.toString());
        return { marginfiAccount, accounts: [marginfiAccount] };
    } catch (error) {
        console.error("Error creating and fetching accounts:", error);
        throw error;
    }
};

// Manage accounts and perform actions like borrowing or deposits
const manageAccounts = async (client: MarginfiClient, marginfiAccount: any, bank: any) => {
    try {
        const balance = await marginfiAccount.getBalance(bank.publicKey);
        console.log("Updated account balance:", balance);
        return balance;
    } catch (error) {
        console.error("Error managing account:", error);
        throw error;
    }
};

/**
 * Main function to run all steps
 */
const main = async () => {
    try {
        const client = await initializeClient();

        const { marginfiAccount } = await createFetchAccounts(client);
        const solBank = await fetchBank(client, "SOL");
        await manageAccounts(client, marginfiAccount, solBank);
        await borrowFunds(client, marginfiAccount, solBank);

        console.log("Funds borrowed successfully.");
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

main().catch(err => console.error("Error in main function:", err));
