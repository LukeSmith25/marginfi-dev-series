import { Connection } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";
import { loadKeypairFromFile } from "../../common/utils/utils";
import { fetchBank } from "../../common/utils/fetchBank";
import { depositFunds } from "../../common/utils/depositFunds";
import { borrowFunds } from "../../common/utils/borrowFunds";
import { createFetchAccounts } from "../../common/utils/createFetchAccounts";
import { getAccountBalance } from "../../common/utils/getAccountBalance";
import environment from "../../config/environment";

const main = async () => {
    try {
        const connection = new Connection(environment.clusterUrl, "confirmed");
        const walletKeypair = loadKeypairFromFile(`${process.env.MARGINFI_WALLET}`);
        const wallet = new NodeWallet(walletKeypair);

        const config = getConfig(environment.environment);
        const client = await MarginfiClient.fetch(config, wallet, connection);

        console.log("Step 1: Creating Marginfi Account...");
        const { marginfiAccount } = await createFetchAccounts(client);

        console.log("Step 2: Fetching SOL Bank...");
        const solBank = await fetchBank(client, "SOL");

        console.log("Step 3: Depositing Funds...");
        await depositFunds(client, marginfiAccount, solBank, 0.0001);

        console.log("Step 4: Borrowing Funds...");
        await borrowFunds(client, marginfiAccount, solBank, connection);

        console.log("Step 5: Managing Accounts...");
        await getAccountBalance(client, marginfiAccount, solBank);

        console.log("Funds borrowed and managed successfully.");
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

main().catch(err => console.error("Error in main function:", err));
