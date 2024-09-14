import { Connection, Keypair } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";
import * as fs from "fs";
import * as os from "os"; // For resolving the home directory

// Load the environment (assume it's defined elsewhere)
import environment from "../config/environment";

// Helper function to load keypair from a file
const loadKeypairFromFile = (path: string): Keypair => {
    const secretKey = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
}

/**
 * Initializes the Marginfi client with the configured environment.
 * @returns {Promise<MarginfiClient>} - Returns the initialized Marginfi client
 */
export const initializeClient = async (): Promise<MarginfiClient> => {
    const { clusterUrl, environment: envName } = environment;
    const connection = new Connection(clusterUrl, "confirmed");

    // Resolve the full path to the wallet JSON file
    const walletPath = `${os.homedir()}/solana-wallets/my-wallet/my-wallet.json`;

    // Load the keypair manually
    const walletKeypair = loadKeypairFromFile(walletPath);
    const wallet = new NodeWallet(walletKeypair); // Create NodeWallet with this keypair

    const config = getConfig(envName);  // Uses "production" now
    return await MarginfiClient.fetch(config, wallet, connection);
};
