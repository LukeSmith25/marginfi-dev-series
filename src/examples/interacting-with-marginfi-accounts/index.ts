import { initializeClient } from "../../common/utils/initializeClient";
import { fetchBank } from "../../common/utils/fetchBank";
import { depositFunds } from "../../common/utils/depositFunds";
import { borrowFunds } from "../../common/utils/borrowFunds";
import { createFetchAccounts } from "../../common/utils/createFetchAccounts";
import { manageAccounts } from "../../common/utils/manageAccounts";
import {Connection} from "@solana/web3.js";

import * as dotenv from "dotenv";
import { Environment } from "@mrgnlabs/marginfi-client-v2";
import * as os from "node:os";

// Load environment variables from .env file
dotenv.config();

// Use environment variables for configuration
const clusterUrl = process.env.MARGINFI_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const walletPath = process.env.MARGINFI_WALLET || `${os.homedir()}/solana-wallets/my-wallet/my-wallet.json`;
const environment: Environment = process.env.MARGINFI_ENV as Environment || "production"; // Set to production

const main = async () => {
    try {
        const client = await initializeClient();
        const connection = new Connection(clusterUrl, "confirmed");

        console.log("Step 1: Creating Marginfi Account...");
        const { marginfiAccount } = await createFetchAccounts(client);

        console.log("Step 2: Fetching SOL Bank...");
        const solBank = await fetchBank(client, "SOL");

        console.log("Step 3: Depositing Funds...");
        await depositFunds(client, marginfiAccount, solBank, 0.0001);

        console.log("Step 4: Borrowing Funds...");
        await borrowFunds(client, marginfiAccount, solBank, connection);

        console.log("Step 5: Managing Accounts...");
        await manageAccounts(client, marginfiAccount, solBank);

        console.log("Funds borrowed and managed successfully.");
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

main().catch(err => console.error("Error in main function:", err));
