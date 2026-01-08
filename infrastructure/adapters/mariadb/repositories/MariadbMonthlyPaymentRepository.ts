import { MonthlyPayment } from "../../../../domain/entities/MonthlyPayment";
import { MariadbConnection } from "../config/MariadbConnection";
import { MonthlyPaymentModel } from "../models/MonthlyPaymentModel";
import { UserModel } from "../models/UserModel";
import { MonthlyPaymentRepositoryInterface } from "../../../../application/repositories/MonthlyPaymentRepositoryInterface";
import { AccountModel } from "../models/AccountModel";
import { InvalidAmountError } from "../../../../domain/errors/entities/monthly-payment/InvalidAmountError";
import { BankCreditModel } from "../models/BankCreditModel";
import { BankCreditNotFoundError } from "../../../../domain/errors/entities/bank-credit/BankCreditNotFoundError";

export class MariadbMonthlyPaymentRepository implements MonthlyPaymentRepositoryInterface {
  private monthlyPaymentModel: MonthlyPaymentModel;
  private bankCreditModel: BankCreditModel;

  public constructor(databaseDsn: string) {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    const accountModel = new AccountModel(connection, userModel);
    this.bankCreditModel = new BankCreditModel(connection, userModel, accountModel);
    this.monthlyPaymentModel = new MonthlyPaymentModel(connection, this.bankCreditModel);
  }

  public async create(monthlyPayment: MonthlyPayment): Promise<MonthlyPayment | BankCreditNotFoundError | InvalidAmountError> {
    try {
      const createdMonthlyPayment = await this.monthlyPaymentModel.model.create({
        amount: monthlyPayment.amount,
        bankCreditId: monthlyPayment.bankCreditId,
      });

      const maybeMonthlyPayment = MonthlyPayment.from(createdMonthlyPayment);
      if (maybeMonthlyPayment instanceof Error) {
        throw maybeMonthlyPayment;
      }

      return maybeMonthlyPayment;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        return new BankCreditNotFoundError('Bank credit not found.');
      }

      return new BankCreditNotFoundError('Bank credit not found.');
    }
  }

  public async findAllByBankCredit(bankCreditId: number): Promise<MonthlyPayment[]> {
    try {
      const foundMonthlyPayments = await this.monthlyPaymentModel.model.findAll({
        where: {
          bankCreditId,
        },
      });

      const monthlyPayments: MonthlyPayment[] = [];

      foundMonthlyPayments.forEach((foundMonthlyPayment) => {
        const maybeMonthlyPayment = MonthlyPayment.from(foundMonthlyPayment);
        if (maybeMonthlyPayment instanceof Error) {
          throw maybeMonthlyPayment;
        }

        monthlyPayments.push(maybeMonthlyPayment);
      });

      return monthlyPayments;
    } catch (error) {
      return [];
    }
  }
}
