import { initializeClient } from "src/common/utils";
import environment from "src/config/environment";

/**
 * Step 1: Fetch a Bank by Symbol and Log Details
 */
export const fetchBank = async () => {
    const client = await initializeClient(environment.clusterUrl, environment.environment);

    // Fetch the bank by token symbol
    const bankLabel = "SOL";
    const bank = await client.getBankByTokenSymbol(bankLabel);
    if (!bank) throw new Error(`${bankLabel} bank not found`);

    console.log("Fetched bank:", bank.address.toBase58());
};
