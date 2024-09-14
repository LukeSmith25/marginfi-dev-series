import { Connection, PublicKey } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig, Bank, Environment, AccountType } from "@mrgnlabs/marginfi-client-v2";
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
 * Fetches a list of all accounts (possibly banks) and finds the one with a specific token symbol.
 * @param client - The MarginfiClient instance
 * @param tokenSymbol - The token symbol to fetch the bank for (e.g., "SOL")
 * @returns {Promise<Bank>} - Returns the found Bank instance
 */
const fetchBank = async (client: MarginfiClient, tokenSymbol: string): Promise<Bank | null> => {
    try {
        // Fetch all Marginfi account keys
        const bankPubKeys = await client.getAllProgramAccountAddresses(AccountType.MarginfiGroup); // Use an existing AccountType

        console.log("Bank Public Keys:", bankPubKeys);

        // Fetch and process banks
        const banks = await Promise.all(
            bankPubKeys.map(async (bankPubKey) => {
                const accountInfo = await client.provider.connection.getAccountInfo(bankPubKey);
                if (!accountInfo) {
                    console.error(`Failed to fetch account info for ${bankPubKey.toString()}`);
                    return null;
                }
                // Parse bank data from buffer
                return Bank.fromBuffer(bankPubKey, accountInfo.data);  // Adjust according to actual method in the Bank class
            })
        );

        // Filter and return the bank matching the token symbol
        const validBanks = banks.filter(bank => bank !== null);
        const bankForToken = validBanks.find(bank => bank.tokenSymbol === tokenSymbol);

        if (!bankForToken) throw new Error(`Bank not found for token symbol: ${tokenSymbol}`);
        console.log("Fetched bank:", bankForToken);
        return bankForToken;

    } catch (error) {
        console.error("Error fetching bank:", error);
        throw error;
    }
};

/**
 * Borrows funds from a specific bank
 * @param client - The MarginfiClient instance
 * @param bank - The Bank instance from which to borrow
 * @param amount - The amount to borrow
 */
const borrowFunds = async (client: MarginfiClient, account: any, bank: Bank, amount: BigNumber) => {
    try {
        // Ensure that `account.borrow` is used properly with `Bank` instance
        await account.borrow(amount, bank);  // Pass the Bank object, not just PublicKey
        console.log(`Borrowed ${amount.toString()} from the bank: ${bank.publicKey.toString()}`);
    } catch (error) {
        console.error("Error borrowing funds:", error);
        throw error;
    }
};

/**
 * Creates and fetches Marginfi accounts
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

        // Fetch all accounts for this authority
        const fetchedAccounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
        console.log("Fetched accounts:", fetchedAccounts);

        return { marginfiAccount, accounts: fetchedAccounts };
    } catch (error) {
        console.error("Error creating and fetching accounts:", error);
        throw error;
    }
};

/**
 * Manages account operations like borrowing and retrieving balances
 * @param client - The MarginfiClient instance
 * @param account - The Marginfi account to manage
 * @param bank - The bank from which to borrow funds
 * @param borrowAmount - The amount of SOL to borrow
 */
const manageAccount = async (client: MarginfiClient, account: any, bank: Bank, borrowAmount: BigNumber) => {
    try {
        console.log("Managing account:", account.publicKey.toString());

        // Borrow funds from the bank
        await borrowFunds(client, account, bank, borrowAmount);

        // Fetch the updated balance for the account (placeholder)
        const updatedBalance = await account.getBalance(bank.publicKey);  // Ensure `getBalance` accepts bank's PublicKey
        console.log("Updated account balance:", updatedBalance);

        return updatedBalance;
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
        // Initialize the client
        const client = await initializeClient();

        // Step 1: Create and Fetch Accounts
        const { marginfiAccount, accounts } = await createFetchAccounts(client);
        console.log("Fetched accounts:", accounts);

        // Step 2: Fetch the bank for SOL
        const solBank = await fetchBank(client, "SOL");

        // Step 3: Manage the account and borrow 0.01 SOL
        const borrowAmount = new BigNumber(0.01);  // Borrow 0.01 SOL
        const balance = await manageAccount(client, marginfiAccount, solBank, borrowAmount);

        console.log("Final account balance after borrow:", balance);
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

main().catch(err => console.error("Error in main function:", err));

