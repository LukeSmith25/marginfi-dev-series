import { initializeClient } from "src/common/utils";
import environment from "src/config/environment";

/**
 * Step 2: Explore Bank Methods (fetch multiple banks and log details)
 */
export const exploreBankMethods = async () => {
    const client = await initializeClient(environment.clusterUrl, environment.environment);

    // Fetch multiple banks by symbol
    const symbols = ["SOL", "USDC"];
    const banks = await Promise.all(symbols.map(symbol => client.getBankByTokenSymbol(symbol)));

    // Log the details of each bank
    banks.forEach(bank => {
        console.log("Bank details for:", bank.symbol, bank);
    });
};
