export const checkBankOperationalState = (bank: any) => {
    if (bank.config.operationalState !== 'Operational') {
        throw new Error(`Bank ${bank.tokenSymbol} is not operational. Current state: ${bank.config.operationalState}`);
    }
};
