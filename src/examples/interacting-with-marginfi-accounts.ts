import { Connection, Keypair } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import {MarginfiClient, getConfig, Environment} from "@mrgnlabs/marginfi-client-v2";
import * as fs from "fs";
import * as os from "os";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();
const clusterUrl = process.env.MARGINFI_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const walletPath = process.env.MARGINFI_WALLET || `${os.homedir()}/solana-wallets/my-wallet/my-wallet.json`;
const environment = process.env.MARGINFI_ENV || "production";

// Load wallet keypair from file
const loadWalletKeypair = (path: string): Keypair => {
    const secretKey = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
};

// Initialize Marginfi client
const setupMarginfiClient = async (): Promise<MarginfiClient> => {
    const connection = new Connection(clusterUrl, "confirmed");
    const walletKeypair = loadWalletKeypair(walletPath);
    const wallet = new NodeWallet(walletKeypair);
    const config = getConfig(environment as Environment);
    return MarginfiClient.fetch(config, wallet, connection);
};

// Create or fetch Marginfi account
const handleAccountSetup = async (client: MarginfiClient) => {
    const accounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
    if (accounts.length > 0) {
        console.log("Found existing accounts:", accounts);
        return { marginfiAccount: accounts[0] };
    }
    const marginfiAccount = await client.createMarginfiAccount();
    console.log("Created new Marginfi account:", marginfiAccount.address.toString());
    return { marginfiAccount };
};

// Fetch bank details by token symbol
const retrieveBankDetails = async (client: MarginfiClient, tokenSymbol: string) => {
    const bank = client.getBankByTokenSymbol(tokenSymbol);
    if (!bank) throw new Error(`Bank not found for symbol: ${tokenSymbol}`);
    console.log("Fetched bank:", bank);
    return bank;
};

// Deposit funds into Marginfi account
const performDeposit = async (marginfiAccount: any, bank: any, depositAmount: number) => {
    console.log(`Depositing ${depositAmount} SOL into bank ${bank.address.toBase58()}`);
    await marginfiAccount.deposit(depositAmount, bank.address);
    console.log(`Deposited ${depositAmount} SOL into bank ${bank.address.toBase58()}`);
};

// Withdraw funds from Marginfi account
const performWithdrawal = async (marginfiAccount: any, bank: any, withdrawAmount: number) => {
    try {
        console.log(`Attempting to withdraw ${withdrawAmount} SOL from bank ${bank.address.toBase58()}`);
        await marginfiAccount.withdraw(withdrawAmount, bank.address);
        console.log(`Successfully withdrew ${withdrawAmount} SOL from bank ${bank.address.toBase58()}`);
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        throw error;
    }
};

// Ensure enough collateral is available
const validateCollateral = async (marginfiAccount: any, bank: any) => {
    const balance = await marginfiAccount.getBalance(bank.address);
    if (balance.assetShares.lte(0)) throw new Error("Insufficient collateral for borrowing.");
};

// Ensure the bank is operational
const ensureBankIsOperational = (bank: any) => {
    if (bank.config.operationalState !== 'Operational') {
        throw new Error(`Bank ${bank.tokenSymbol} is not operational.`);
    }
};

// Borrow funds from the Marginfi bank
const performBorrowing = async (marginfiAccount: any, bank: any, borrowAmount: number = 0.0001) => {
    console.log(`Attempting to borrow ${borrowAmount} SOL from bank ${bank.address.toBase58()}`);
    await validateCollateral(marginfiAccount, bank);
    ensureBankIsOperational(bank);
    await marginfiAccount.borrow(borrowAmount, bank.address);
    console.log(`Borrowed ${borrowAmount} SOL from bank ${bank.address.toBase58()}`);
};

// Check account balance
const checkAccountStatus = async (marginfiAccount: any, bank: any) => {
    const balance = await marginfiAccount.getBalance(bank.address);
    console.log("Current account balance:", balance);
    return balance;
};

// Main function to run all steps
const main = async () => {
    try {
        const client = await setupMarginfiClient();

        console.log("Step 1: Creating Marginfi Account...");
        const { marginfiAccount } = await handleAccountSetup(client);

        console.log("Step 2: Fetching SOL Bank...");
        const solBank = await retrieveBankDetails(client, "SOL");

        console.log("Step 3: Depositing Funds...");
        await performDeposit(marginfiAccount, solBank, 0.0001);

        console.log("Step 4: Borrowing Funds...");
        await performBorrowing(marginfiAccount, solBank);

        console.log("Step 5: Managing Account...");
        await checkAccountStatus(marginfiAccount, solBank);

        console.log("Step 6: Withdrawing Funds...");
        await performWithdrawal(marginfiAccount, solBank, 0.00005);

        console.log("Funds borrowed, managed, and withdrawn successfully.");
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

main().catch(err => console.error("Error in main function:", err));
