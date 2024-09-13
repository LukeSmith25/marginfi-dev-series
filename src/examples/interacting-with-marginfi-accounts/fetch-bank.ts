/**
 * Fetch a bank by symbol and return it.
 */
export const fetchBank = async (client: any) => {
    const bankLabel = "SOL";
    const bank = await client.getBankByTokenSymbol(bankLabel);
    if (!bank) throw new Error(`${bankLabel} bank not found`);

    return bank;
};
