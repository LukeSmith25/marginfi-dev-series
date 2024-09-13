import { Connection } from "@solana/web3.js";
import {getConfig, MarginfiClient} from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";
import { createOrFetchMarginfiAccount } from "./createOrFetchMarginfiAccount"


const RPC_ENDPOINT = "https://api.devnet.solana.com";
const DEPOSIT_AMOUNT_SOL = 0.01;

async function depositSolIntoMarginfi() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("dev");
    const client = await MarginfiClient.fetch(config, wallet, connection);

    const marginfiAccount = await createOrFetchMarginfiAccount();  // Use the previous function

    const solBank = client.getBankByTokenSymbol("SOL");
    if (!solBank) throw Error(`SOL bank not found`);

    await marginfiAccount.deposit(DEPOSIT_AMOUNT_SOL, solBank.address);
    console.log(`Deposited ${DEPOSIT_AMOUNT_SOL} SOL into Marginfi account`);
}

depositSolIntoMarginfi().catch((e) => console.log(e));
