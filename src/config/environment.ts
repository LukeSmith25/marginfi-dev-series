import * as dotenv from "dotenv";  // To load .env file
import { Environment } from "@mrgnlabs/marginfi-client-v2";  // Import Environment type

// Load environment variables from .env file
dotenv.config();

// Use .env variables for environment configuration
const environment = {
    clusterUrl: process.env.MARGINFI_RPC_ENDPOINT || "https://api.mainnet-beta.solana.com",
    environment: process.env.MARGINFI_ENV as Environment || "production",
    walletPath: process.env.MARGINFI_WALLET,
};

export default environment;
