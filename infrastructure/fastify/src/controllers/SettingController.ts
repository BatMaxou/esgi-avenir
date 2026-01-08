import { FastifyRequest, FastifyReply } from "fastify";

import { SettingRepositoryInterface } from "../../../../application/repositories/SettingRepositoryInterface";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";
import { UpsertSettingCommand } from "../../../../application/commands/setting/UpsertSettingCommand";
import { InvalidUpsertSettingCommandError } from "../../../../application/errors/commands/setting/InvalidUpsertSettingCommandError";
import { UpsertSettingUsecase } from "../../../../application/usecases/setting/UpsertSettingUsecase";
import { GetSettingListUsecase } from "../../../../application/usecases/setting/GetSettingListUsecase";
import { SendUpdateSavingsRateEmailUsecase } from "../../../../application/usecases/email/SendUpdateSavingsRateEmailUsecase";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { SettingNotFoundError } from "../../../../domain/errors/entities/setting/SettingNotFoundError";
import { GetSettingParams, SettingParams } from "../../../../application/params/setting/GetSettingParams";
import { InvalidGetSettingParamsError } from "../../../../application/errors/params/setting/InvalidGetSettingParamsError";
import { GetSettingUsecase } from "../../../../application/usecases/setting/GetSettingUsecase";
import { UpsertSettingPayloadInterface } from "../../../../application/services/api/resources/SettingResourceInterface";

export class SettingController {
  public constructor(
    private readonly settingRepository: SettingRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface,
  ) {}

  public async upsert(request: FastifyRequest<{Body: UpsertSettingPayloadInterface}>, response: FastifyReply) {
    const maybeCommand = UpsertSettingCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpsertSettingCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const upsertUsecase = new UpsertSettingUsecase(this.settingRepository);
    const maybeSetting = await upsertUsecase.execute(
      maybeCommand.code,
      maybeCommand.value,
    );

    if (maybeSetting instanceof Error) {
      return response.status(400).send({
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

    response.status(200).send(maybeSetting);
  }

  public async get(request: FastifyRequest<{Params: SettingParams}>, response: FastifyReply) {
    const maybeParams = GetSettingParams.from(request.params);
    if (maybeParams instanceof InvalidGetSettingParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const getUsecase = new GetSettingUsecase(this.settingRepository);
    const maybeSetting = await getUsecase.execute(maybeParams.code);
    if (maybeSetting instanceof SettingNotFoundError) {
      return response.status(404).send({
        error: maybeSetting.message,
      });
    }

    response.status(200).send(maybeSetting);
  }

  public async list(request: FastifyRequest, response: FastifyReply) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: 'Unauthorized',
      });
    }
    
    const getListUsecase = new GetSettingListUsecase(this.settingRepository);
    const settings = await getListUsecase.execute();

    response.status(200).send(settings);
  }
}
