import { Connection } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig, Bank, Environment } from "@mrgnlabs/marginfi-client-v2";
import { BigNumber } from "bignumber.js";

// Define environment configuration
const clusterUrl = "https://api.mainnet-beta.solana.com"; // Only using mainnet
const environment: Environment = "production";  // Set the environment to production

/**
 * Initializes the Marginfi client with the configured environment.
 * @returns {Promise<MarginfiClient>} - Returns the initialized Marginfi client
 */
const initializeClient = async (): Promise<MarginfiClient> => {
    const connection = new Connection(clusterUrl, "confirmed");
    const wallet = NodeWallet.local();  // Your local wallet
    const config = getConfig(environment);
    return await MarginfiClient.fetch(config, wallet, connection);
};

/**
 * Fetches a bank using its token symbol (e.g., "SOL").
 * @param client - The MarginfiClient instance
 * @param tokenSymbol - The token symbol to fetch the bank for (e.g., "SOL")
 * @returns {Promise<Bank | null>} - Returns the found Bank instance or null
 */
const fetchBank = async (client: MarginfiClient, tokenSymbol: string): Promise<Bank | null> => {
    try {
        // Use the client's method to get the bank by token symbol
        const bank = client.getBankByTokenSymbol(tokenSymbol);
        if (!bank) {
            throw new Error(`Bank not found for token symbol: ${tokenSymbol}`);
        }
        console.log(`Fetched bank for ${tokenSymbol}:`, bank);
        return bank;
    } catch (error) {
        console.error("Error fetching bank:", error);
        throw error;
    }
};

/**
 * Borrows funds from a specific bank.
 * @param account - The Marginfi account
 * @param bank - The Bank instance from which to borrow
 * @param amount - The amount to borrow
 */
const borrowFunds = async (account: any, bank: Bank, amount: BigNumber) => {
    try {
        // Borrow the amount from the bank
        await account.borrow(amount, bank);
        console.log(`Borrowed ${amount.toString()} from the bank: ${bank.publicKey.toString()}`);
    } catch (error) {
        console.error("Error borrowing funds:", error);
        throw error;
    }
};

/**
 * Creates or fetches Marginfi accounts.
 * @param client - The MarginfiClient instance
 */
const createFetchAccounts = async (client: MarginfiClient) => {
    try {
        // Check for existing accounts
        const accounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
        if (accounts.length > 0) {
            console.log("Found existing accounts:", accounts);
            return { marginfiAccount: accounts[0], accounts };
        }

        // Create a new account if none exist
        const marginfiAccount = await client.createMarginfiAccount();
        console.log("Created new Marginfi account:", marginfiAccount.publicKey.toString());

        return { marginfiAccount, accounts: [marginfiAccount] };
    } catch (error) {
        console.error("Error creating and fetching accounts:", error);
        throw error;
    }
};

/**
 * Manages account operations like borrowing and retrieving balances.
 * @param account - The Marginfi account to manage
 * @param bank - The bank from which to borrow funds
 * @param borrowAmount - The amount of SOL to borrow
 */
const manageAccount = async (account: any, bank: Bank, borrowAmount: BigNumber) => {
    try {
        console.log("Managing account:", account.publicKey.toString());

        // Borrow funds from the bank
        await borrowFunds(account, bank, borrowAmount);

        // Fetch the updated balance for the account (if available)
        const updatedBalance = await account.getBalance(bank.publicKey);
        console.log("Updated account balance:", updatedBalance);

        return updatedBalance;
    } catch (error) {
        console.error("Error managing account:", error);
        throw error;
    }
};

/**
 * Main function to run all steps.
 */
const main = async () => {
    try {
        // Step 1: Initialize the client
        const client = await initializeClient();

        // Step 2: Create and fetch accounts
        const { marginfiAccount } = await createFetchAccounts(client);

        // Step 3: Fetch the bank for SOL
        const solBank = await fetchBank(client, "SOL");
        if (!solBank) throw new Error("SOL bank not found");

        // Step 4: Manage the account and borrow 0.01 SOL
        const borrowAmount = new BigNumber(0.01);  // Borrow 0.01 SOL
        const balance = await manageAccount(marginfiAccount, solBank, borrowAmount);

        console.log("Final account balance after borrow:", balance);
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

// Execute the main function
main().catch(err => console.error("Error in main function:", err));
