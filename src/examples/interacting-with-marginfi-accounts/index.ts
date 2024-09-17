import {Connection, Keypair, SendTransactionError} from "@solana/web3.js";
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
        console.log("Bank Address (PublicKey):", bank.address?.toBase58());

        return bank;
    } catch (error) {
        console.error("Error fetching bank:", error);
        throw error;
    }
};


const depositFunds = async (client: MarginfiClient, marginfiAccount: any, bank: any, depositAmount: number) => {
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


// Modified borrowFunds with enhanced error logging
const borrowFunds = async (client: MarginfiClient, marginfiAccount: any, bank: any, connection: Connection) => {
    try {
        const borrowAmount = 0.0001;

        // Ensure marginfiAccount and bank are properly initialized
        if (!marginfiAccount) {
            throw new Error("MarginfiAccount is undefined");
        }
        if (!bank?.address) {
            throw new Error("Bank Address (PublicKey) is undefined");
        }

        // Log before borrowing
        console.log(`Attempting to borrow ${borrowAmount} SOL from bank ${bank.address.toBase58()}`);

        // Check for collateral
        await checkCollateral(client, marginfiAccount, bank);

        // Check if the bank is in operational state
        checkBankOperationalState(bank);

        // Attempt to borrow funds
        await marginfiAccount.borrow(borrowAmount, bank.address);
        console.log(`Borrowed ${borrowAmount} SOL from bank ${bank.address.toBase58()}`);
    } catch (error) {
        // Enhanced logging for transaction error
        if (error instanceof SendTransactionError) {
            console.error("Transaction simulation failed. Logs:");
            const logs = await error.getLogs(connection);
            console.error(logs);  // Log the actual logs for debugging
            console.error("Full error message:", error.message);
        } else {
            console.error("Error borrowing funds:", error);
        }
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
        // Ensure bank and publicKey exist
        if (!bank || !bank.address) {
            throw new Error("Bank or Bank Address (PublicKey) is undefined");
        }

        const balance = await marginfiAccount.getBalance(bank.address);
        console.log("Updated account balance:", balance);
        return balance;
    } catch (error) {
        console.error("Error managing account:", error);
        throw error;
    }
};


const checkCollateral = async (client: MarginfiClient, marginfiAccount: any, bank: any) => {
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

const checkBankOperationalState = (bank: any) => {
    if (bank.config.operationalState !== 'Operational') {
        throw new Error(`Bank ${bank.tokenSymbol} is not operational. Current state: ${bank.config.operationalState}`);
    }
};

/**
 * Main function to run all steps
 */
/**
 * Main function to run all steps
 */
const main = async () => {
    try {
        const client = await initializeClient();
        const connection = new Connection(clusterUrl, "confirmed");

        const { marginfiAccount } = await createFetchAccounts(client);
        const solBank = await fetchBank(client, "SOL");

        // Deposit funds before borrowing
        // Deposit 0.005 SOL
        await depositFunds(client, marginfiAccount, solBank, 0.0001);

        // Borrow 0.0001 SOL (already set in your borrowFunds function)
        await borrowFunds(client, marginfiAccount, solBank, connection);


        await manageAccounts(client, marginfiAccount, solBank);
        await borrowFunds(client, marginfiAccount, solBank, connection);

        console.log("Funds borrowed successfully.");
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

main().catch(err => console.error("Error in main function:", err));