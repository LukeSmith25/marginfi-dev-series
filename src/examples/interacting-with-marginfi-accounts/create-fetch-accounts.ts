/**
 * Step 1: Create and Fetch Marginfi Accounts
 * Returns the created Marginfi account and fetched accounts.
 */
export const createFetchAccounts = async (client: any) => {
    // Create a Marginfi account
    const marginfiAccount = await client.createMarginfiAccount();
    console.log("Marginfi account created:", marginfiAccount.publicKey.toString());

    // Fetch all Marginfi accounts by authority (PublicKey)
    const accounts = await client.getMarginfiAccountsForAuthority("YourPublicKeyHere");

    // Return the created account and fetched accounts
    return { marginfiAccount, accounts };
};

