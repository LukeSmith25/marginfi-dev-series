import { Connection } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";
import environment from "../../config/environment";
import { loadKeypairFromFile } from "./utils";
import * as os from "os";

// Load the wallet path from the environment or use a default one
const walletPath = process.env.MARGINFI_WALLET || `${os.homedir()}/solana-wallets/my-wallet/my-wallet.json`;

// Initialize the Marginfi client
export const initializeClient = async (): Promise<MarginfiClient> => {
    const connection = new Connection(environment.clusterUrl, "confirmed");

    // Load the wallet keypair from file
    const walletKeypair = loadKeypairFromFile(walletPath);
    const wallet = new NodeWallet(walletKeypair);

    const config = getConfig(environment.environment);  // Use environment configuration
    return await MarginfiClient.fetch(config, wallet, connection);
};
