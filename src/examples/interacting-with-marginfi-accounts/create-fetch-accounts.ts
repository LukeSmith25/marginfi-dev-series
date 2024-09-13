/**
 * Creates a new Marginfi account and fetches accounts by authority.
 */
export const createFetchAccounts = async (client: any) => {
    try {
        // Create a new Marginfi account
        const marginfiAccount = await client.createMarginfiAccount();
        console.log("Created Marginfi account:", marginfiAccount.publicKey.toString());

        // Fetch accounts associated with the authority (current wallet public key)
        const accounts = await client.getMarginfiAccountsForAuthority(client.wallet.publicKey);
        console.log("Fetched accounts:", accounts);

        return { marginfiAccount, accounts }; // Return the account and accounts list
    } catch (error) {
        console.error("Error creating and fetching accounts:", error);
        throw error;
    }
};
