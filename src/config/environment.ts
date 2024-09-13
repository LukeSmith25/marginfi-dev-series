import { Environment } from "@mrgnlabs/marginfi-client-v2";  // Use the correct Environment type from the SDK

// Define configurations for both dev and production environments
const environments = {
    dev: {
        clusterUrl: "https://api.devnet.solana.com",
        environment: "dev"  // Use "dev"
    },
    production: {
        clusterUrl: "https://api.mainnet-beta.solana.com",
        environment: "production"  // Use "production"
    }
};

// Set the environment you want to use (can be dynamically set based on process.env or any other logic)
const currentEnvironment = environments.dev;  // Change this to environments.production for production

export default currentEnvironment;
