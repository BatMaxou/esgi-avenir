import { MonthlyPayment } from "../../../../domain/entities/MonthlyPayment";
import { MonthlyPaymentRepositoryInterface } from "../../../../application/repositories/MonthlyPaymentRepositoryInterface";
import { InvalidAmountError } from "../../../../domain/errors/entities/monthly-payment/InvalidAmountError";
import { BankCreditNotFoundError } from "../../../../domain/errors/entities/bank-credit/BankCreditNotFoundError";
import { MonthlyPaymentModel } from "../models/MonthlyPaymentModel";
import { BankCreditModel } from "../models/BankCreditModel";
import { getNextSequence } from "../models/CounterModel";
import { openConnection } from "../config/MongodbConnection";

export class MongodbMonthlyPaymentRepository
  implements MonthlyPaymentRepositoryInterface
{
  private initialized: boolean = false;

  public constructor() {
    this.ensureConnection();
  }

  private async ensureConnection(): Promise<void> {
    if (!this.initialized) {
      await openConnection();
      this.initialized = true;
    }
  }

  public async create(
    monthlyPayment: MonthlyPayment
  ): Promise<MonthlyPayment | BankCreditNotFoundError | InvalidAmountError> {
    try {
      await this.ensureConnection();

      const maybeBankCredit = await BankCreditModel.findOne({
        id: monthlyPayment.bankCreditId,
      });
      if (!maybeBankCredit) {
        return new BankCreditNotFoundError("Bank credit not found.");
      }

      const nextId = await getNextSequence("monthly_payment_id");

      const createdMonthlyPayment = await MonthlyPaymentModel.create({
        id: nextId,
        amount: monthlyPayment.amount,
        bankCreditId: monthlyPayment.bankCreditId,
        createdAt: monthlyPayment.createdAt || new Date(),
      });

      const maybeMonthlyPayment = MonthlyPayment.from({
        id: createdMonthlyPayment.id,
        amount: createdMonthlyPayment.amount,
        bankCreditId: createdMonthlyPayment.bankCreditId,
        createdAt: createdMonthlyPayment.createdAt,
      });

      if (maybeMonthlyPayment instanceof Error) {
        throw maybeMonthlyPayment;
      }

      return maybeMonthlyPayment;
    } catch (error) {
      return new BankCreditNotFoundError("Bank credit not found.");
    }
  }

  public async findAllByBankCredit(
    bankCreditId: number
  ): Promise<MonthlyPayment[]> {
    try {
      await this.ensureConnection();

      const foundMonthlyPayments = await MonthlyPaymentModel.find({
        bankCreditId,
      });

      const monthlyPayments: MonthlyPayment[] = [];

      foundMonthlyPayments.forEach((foundMonthlyPayment) => {
        const maybeMonthlyPayment = MonthlyPayment.from({
          id: foundMonthlyPayment.id,
          amount: foundMonthlyPayment.amount,
          bankCreditId: foundMonthlyPayment.bankCreditId,
          createdAt: foundMonthlyPayment.createdAt,
        });

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
