import { Connection, Keypair } from "@solana/web3.js";
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { MarginfiClient, getConfig } from "@mrgnlabs/marginfi-client-v2";
import * as fs from "fs";
import * as os from "os";
import * as dotenv from "dotenv";
import { Environment } from "@mrgnlabs/marginfi-client-v2";

dotenv.config();

const clusterUrl = process.env.MARGINFI_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const walletPath = process.env.MARGINFI_WALLET || `${os.homedir()}/solana-wallets/my-wallet/my-wallet.json`;
const environment: Environment = process.env.MARGINFI_ENV as Environment || "production";

export const initializeClient = async (): Promise<MarginfiClient> => {
    const connection = new Connection(clusterUrl, "confirmed");

    const walletKeypair = loadKeypairFromFile(walletPath);
    const wallet = new NodeWallet(walletKeypair);

    const config = getConfig(environment);
    return await MarginfiClient.fetch(config, wallet, connection);
};

// Helper function to load keypair
const loadKeypairFromFile = (path: string): Keypair => {
    const secretKey = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
};
