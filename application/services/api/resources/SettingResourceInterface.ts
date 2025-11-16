import { ApiClientError } from '../ApiClientError';
import type { Setting } from '../../../../domain/entities/Setting';
import { SettingEnum } from '../../../../domain/enums/SettingEnum';

export interface GetSettingResponseInterface extends Setting {}
export interface GetSettingListResponseInterface extends Array<GetSettingResponseInterface> {}

export interface UpsertSettingPayloadInterface {
  code: SettingEnum;
  value: string | number | boolean;
}

export interface SettingResourceInterface {
  getAll(): Promise<GetSettingListResponseInterface | ApiClientError>;
  upsert(data: UpsertSettingPayloadInterface): Promise<GetSettingResponseInterface | ApiClientError>;
}

