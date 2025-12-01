import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import {
  CreateOperationPayloadInterface,
  GetOperationResponseInterface,
  OperationResourceInterface,
} from "../../../../application/services/api/resources/OperationResourceInterface";

export class OperationResource implements OperationResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async create(
    data: CreateOperationPayloadInterface
  ): Promise<GetOperationResponseInterface | ApiClientError> {
    return this.apiClient.post<GetOperationResponseInterface>(
      paths.operation.create,
      data
    );
  }
}
