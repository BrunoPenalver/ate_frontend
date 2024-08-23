
export enum AccountTypeTypes {
    CCP = "Cuenta corriente pesos",
    CCD = "Cuenta corriente dólares",
    CAP = "Caja de ahorro pesos",
    CAD = "Caja de ahorro dólares",
}

export interface AccountType {
    id: number,
    type: AccountTypeTypes,
}
