import { Environment } from "@mrgnlabs/marginfi-client-v2";  // Import Environment type

// Only using mainnet (production) environment
const environment = {
    clusterUrl: "https://api.mainnet-beta.solana.com",
    environment: "production" as Environment  // Use "production" for mainnet
};

export default environment;
