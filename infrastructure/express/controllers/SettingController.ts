import { Request, Response } from "express";
import { SettingRepositoryInterface } from "../../../application/repositories/SettingRepositoryInterface";
import { SettingEnum } from "../../../domain/enums/SettingEnum";
import { UpsertSettingCommand } from "../../../domain/commands/setting/UpsertSettingCommand";
import { InvalidUpsertSettingCommandError } from "../../../domain/errors/commands/setting/InvalidUpsertSettingCommandError";
import { UpsertSettingUsecase } from "../../../application/usecases/setting/UpsertSettingUsecase";
import { GetSettingListUsecase } from "../../../application/usecases/setting/GetSettingListUsecase";
import { SendUpdateSavingsRateEmailUsecase } from "../../../application/usecases/email/SendUpdateSavingsRateEmailUsecase";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";
import { SettingNotFoundError } from "../../../domain/errors/entities/setting/SettingNotFoundError";
import { GetSettingParams } from "../../../domain/params/setting/GetSettingParams";
import { InvalidGetSettingParamsError } from "../../../domain/errors/params/setting/InvalidGetSettingParamsError";
import { GetSettingUsecase } from "../../../application/usecases/setting/GetSettingUsecase";

export class SettingController {
  public constructor(
    private readonly settingRepository: SettingRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface,
  ) {}

  public async upsert(request: Request, response: Response) {
    const maybeCommand = UpsertSettingCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpsertSettingCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const upsertUsecase = new UpsertSettingUsecase(this.settingRepository);
    const maybeSetting = await upsertUsecase.execute(
      maybeCommand.code,
      maybeCommand.value,
    );

    if (maybeSetting instanceof Error) {
      return response.status(400).json({
        error: maybeSetting.message,
      });
    }

    if (maybeCommand.code === SettingEnum.SAVINGS_RATE) {
      const userIds = await this.accountRepository.findSavingsAccountOwnerIds();
      const users = await this.userRepository.findByIds(userIds);
      
      const rate = maybeCommand.value;
      if (typeof rate === 'number' || typeof rate === 'string') {
        const sendEmailUsecase = new SendUpdateSavingsRateEmailUsecase(this.mailer);
        
        users.forEach((user) => {
          sendEmailUsecase.execute(
            user.email,
            typeof rate === 'number' ? rate : parseFloat(rate),
          );
        });
      }
    }

    response.status(200).json(maybeSetting);
  }

  public async get(request: Request, response: Response) {
    const maybeParams = GetSettingParams.from(request.params);
    if (maybeParams instanceof InvalidGetSettingParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const getUsecase = new GetSettingUsecase(this.settingRepository);
    const maybeSetting = await getUsecase.execute(maybeParams.code);
    if (maybeSetting instanceof SettingNotFoundError) {
      return response.status(404).json({
        error: maybeSetting.message,
      });
    }

    response.status(200).json(maybeSetting);
  }

  public async list(request: Request, response: Response) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }
    
    const getListUsecase = new GetSettingListUsecase(this.settingRepository);
    const settings = await getListUsecase.execute();

    response.status(200).json(settings);
  }
}
