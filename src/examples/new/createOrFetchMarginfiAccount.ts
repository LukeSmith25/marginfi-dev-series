import { Connection, PublicKey } from "@solana/web3.js";
import {getConfig, MarginfiClient} from '@mrgnlabs/marginfi-client-v2';
import { NodeWallet } from "@mrgnlabs/mrgn-common";

const RPC_ENDPOINT = "https://api.solana.com";
const PUBLIC_KEY = "FYVCrqZJtMr9rnDPkRxBymCSwvosodcpkrYTebLt9mno"; // Your Phantom wallet public key

export async function createOrFetchMarginfiAccount() {
    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const wallet = NodeWallet.local();
    const config = getConfig("dev");

    const client = await MarginfiClient.fetch(config, wallet, connection);

    const accounts = await client.getMarginfiAccountsForAuthority(new PublicKey(PUBLIC_KEY));
    let marginfiAccount;

    if (accounts.length > 0) {
        // If an account already exists, use it
        marginfiAccount = accounts[0];
        console.log(`Using existing Marginfi account: ${marginfiAccount.publicKey}`);
    } else {
        // If no account exists, create a new one
        marginfiAccount = await client.createMarginfiAccount();
        console.log(`Created new Marginfi account: ${marginfiAccount.publicKey}`);
    }

    return marginfiAccount;
}

createOrFetchMarginfiAccount().catch((e) => console.log(e));
