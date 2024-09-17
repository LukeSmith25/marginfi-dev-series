import { MarginfiClient } from "@mrgnlabs/marginfi-client-v2";

export const createFetchAccounts = async (client: MarginfiClient) => {
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
