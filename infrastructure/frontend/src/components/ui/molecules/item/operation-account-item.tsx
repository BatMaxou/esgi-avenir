"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/atoms/item";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/atoms/avatar";
import {
  HydratedAccountWithOperations,
  useAccounts,
} from "@/contexts/AccountsContext";
import { Operation } from "../../../../../../../domain/entities/Operation";
import { OperationEnum } from "../../../../../../../domain/enums/OperationEnum";

type OperationAccountItemProps = {
  operation: Operation;
  account?: HydratedAccountWithOperations | null;
};

const OperationAccountItem = ({ operation }: OperationAccountItemProps) => {
  const { account } = useAccounts();
  switch (operation.type) {
    case OperationEnum.DEPOSIT:
      return <DepositOperationAccountItem operation={operation} />;
    case OperationEnum.WITHDRAWAL:
      return <WithdrawalOperationAccountItem operation={operation} />;
    case OperationEnum.TRANSFER:
      return (
        <TransferOperationAccountItem operation={operation} account={account} />
      );
    case OperationEnum.INTEREST:
      return <InterestOperationAccountItem operation={operation} />;
    default:
      return null;
  }
};

const DepositOperationAccountItem = ({
  operation,
}: OperationAccountItemProps) => {
  return (
    <Item
      className="p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
      asChild
    >
      <li>
        <ItemMedia>
          <Avatar className="size-10 bg-red-700 justify-center items-center ">
            <AvatarImage
              src="/assets/images/deposit-icon.svg"
              className="w-6 h-6"
            />
            <AvatarFallback>deposit</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <span className="font-semibold text-md">Dépot</span>
        </ItemContent>
        <ItemActions>
          <span className="font-medium text-lg text-green-600">
            +{operation.amount.toFixed(2)} €
          </span>
        </ItemActions>
      </li>
    </Item>
  );
};
const WithdrawalOperationAccountItem = ({
  operation,
}: OperationAccountItemProps) => {
  return (
    <Item
      className="p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
      asChild
    >
      <li>
        <ItemMedia>
          <Avatar className="size-10 bg-red-700 justify-center items-center ">
            <AvatarImage
              src="/assets/images/withdraw-icon.svg"
              className="w-6 h-6"
            />
            <AvatarFallback>withdraw</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <span className="font-semibold text-md">Retrait</span>
        </ItemContent>
        <ItemActions>
          <span className="font-medium text-lg text-red-600">
            -{operation.amount.toFixed(2)} €
          </span>
        </ItemActions>
      </li>
    </Item>
  );
};
const TransferOperationAccountItem = ({
  operation,
  account,
}: OperationAccountItemProps) => {
  return (
    <Item
      className="p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
      asChild
    >
      <li>
        <ItemMedia>
          <Avatar
            className={`size-10 justify-center items-center ${
              operation.toId === account?.id ? "bg-green-700" : "bg-red-700"
            }`}
          >
            <AvatarImage
              src="/assets/images/transfer-white-icon.svg"
              className="w-6 h-6"
            />
            <AvatarFallback>transfer</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <span className="font-semibold text-md">
            {operation.toId === account?.id
              ? "Virement entrant"
              : "Virement sortant"}
          </span>
        </ItemContent>
        <ItemActions>
          {operation.toId === account?.id ? (
            <span className="font-medium text-lg text-green-600">
              +{operation.amount.toFixed(2)} €
            </span>
          ) : (
            <span className="font-medium text-lg text-red-600">
              -{operation.amount.toFixed(2)} €
            </span>
          )}
        </ItemActions>
      </li>
    </Item>
  );
};
const InterestOperationAccountItem = ({
  operation,
}: OperationAccountItemProps) => {
  return (
    <Item
      className="p-4 border border-gray-100 bg-gray-50 rounded-lg shadow-md flex flex-row justify-between items-center"
      asChild
    >
      <li>
        <ItemMedia>
          <Avatar className="size-10 bg-green-700 justify-center items-center ">
            <AvatarImage
              src="/assets/images/interest-icon.svg"
              className="w-6 h-6"
            />
            <AvatarFallback>interest</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <span className="font-semibold text-md">Intérêts épargne</span>
        </ItemContent>
        <ItemActions>
          <span className="font-medium text-lg text-green-600">
            +{operation.amount.toFixed(2)} €
          </span>
        </ItemActions>
      </li>
    </Item>
  );
};
export default OperationAccountItem;
