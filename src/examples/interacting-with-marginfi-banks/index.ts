import { fetchBank } from "./fetch-bank";
import { exploreBankMethods } from "./explore-bank-methods";

/**
 * Main function to run all steps of Video 2: Interacting with Marginfi Banks
 */
const main = async () => {
    // Step 1: Fetch Bank
    await fetchBank();

    // Step 2: Explore Bank Methods
    await exploreBankMethods();
};

main().catch(err => console.error(err));
