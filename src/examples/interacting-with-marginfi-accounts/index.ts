import { createFetchAccounts } from "./create-fetch-accounts";
import { borrowFunds } from "./borrow-funds";
import { manageAccounts } from "./manage-accounts";
import { initializeClient } from "../../common/utils";

/**
 * Main function to run all steps of Video 1: Interacting with Marginfi Accounts
 */
const main = async () => {
    try {
        // Initialize the client once
        const client = await initializeClient();

        // Step 1: Create and Fetch Accounts
        const { marginfiAccount, accounts } = await createFetchAccounts(client);
        console.log("Fetched accounts:", accounts);

        // Step 2: Manage Accounts
        if (marginfiAccount) {
            const balance = await manageAccounts(client, marginfiAccount);
            console.log("Updated account balance:", balance);
        }

        // Step 3: Borrow Funds
        const bankAddress = await borrowFunds(client);
        console.log("Borrowed from bank:", bankAddress);

    } catch (err) {
        // Catch and display any errors that occur
        console.error("An error occurred:", err);
    }
};

main().catch((err) => console.error(err));
