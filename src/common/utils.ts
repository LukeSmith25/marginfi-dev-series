import { Connection } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";
import environment from "../config/environment";

/**
 * Initializes the Marginfi client with the configured environment.
 * @returns {Promise<MarginfiClient>} - Returns the initialized Marginfi client
 */
export const initializeClient = async (): Promise<MarginfiClient> => {
    const { clusterUrl, environment: envName } = environment;
    const connection = new Connection(clusterUrl, "confirmed");
    const wallet = NodeWallet.local();  // Your local wallet; you can also use the Phantom wallet here if required
    const config = getConfig(envName);  // Uses "production" now
    return await MarginfiClient.fetch(config, wallet, connection);
};
