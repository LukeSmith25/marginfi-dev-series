import { Connection } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";

/**
 * Initializes the Marginfi client with a given Solana cluster and environment.
 * @param {string} clusterUrl - The URL of the Solana cluster
 * @param {"dev" | "production"} environment - The environment to use ("dev" or "production")
 * @returns {Promise<MarginfiClient>} - Returns the initialized Marginfi client
 */
export const initializeClient = async (clusterUrl: string, environment: "dev" | "production"): Promise<MarginfiClient> => {
    const connection = new Connection(clusterUrl, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig(environment);  // Only accepts "dev" or "production"
    return await MarginfiClient.fetch(config, wallet, connection);
};
