import { Dialog } from 'primereact/dialog';
import { BankAccountsTable } from './BankAccountTable';
import { useEffect, useState } from 'react';
import BankAccount from '../../../../interfaces/orders/bankAccount';


export const BankAccountsDialog = ({ isOpen, beneficiary, setIsOpen }) => {
    const [BankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  useEffect(() => {
    if (beneficiary) setBankAccounts(beneficiary.bankAccounts);
  }, [beneficiary]);


  return (
    <Dialog
      header={`Cuentas bancarias de ${beneficiary?.businessName}`}
      style={{ width: "95%" }}
      visible={isOpen}
      onHide={() => setIsOpen()}
    >
      <BankAccountsTable bankAccounts={BankAccounts} beneficiaryId={beneficiary?.id} />
      
    </Dialog>
  );
};