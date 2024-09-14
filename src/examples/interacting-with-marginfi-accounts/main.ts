import { Connection } from "@solana/web3.js";
import { MarginfiClient, getConfig } from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

const CLUSTER_CONNECTION = "https://api.mainnet-beta.solana.com";

const main = async () => {
    const connection = new Connection(CLUSTER_CONNECTION, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("dev");
    const client = await MarginfiClient.fetch(config, wallet, connection); // initialize client

    const marginfiAccount = await client.createMarginfiAccount(); // create an account

    const bankLabel = "SOL";
    const bank = client.getBankByTokenSymbol(bankLabel);
    if (!bank) throw Error(`${bankLabel} bank not found`); // fetch a bank

    await marginfiAccount.deposit(1, bank.address); // make a deposit
    await marginfiAccount.borrow(1, bank.address); // borrow from a bank
};

main();
