import { MeResourceInterface } from "../../../../application/services/api/resources/MeResourceInterface";
import { MeResource } from "../resources/MeResource";
import { eraseCookie, getCookie, setCookie } from "../../../utils/frontend/cookies";
import { paths } from "../../../../application/services/api/paths";
import { ApiClientInterface, ConfirmResponseInterface, DeleteResponseInterface, LoginResponseInterface, RegisterResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { UserResourceInterface } from "../../../../application/services/api/resources/UserResourceInterface";
import { UserResource } from "../resources/UserResource";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { handleApiError } from "../utils/handleApiError";
import { AccountResource } from "../resources/AccountResource";
import { OperationResource } from "../resources/OperationResource";
import { SettingResourceInterface } from "../../../../application/services/api/resources/SettingResourceInterface";
import { OperationResourceInterface } from "../../../../application/services/api/resources/OperationResourceInterface";
import { AccountResourceInterface } from "../../../../application/services/api/resources/AccountResourceInterface";
import { SettingResource } from "../resources/SettingResource";
import { StockResourceInterface } from "../../../../application/services/api/resources/StockResourceInterface";
import { StockResource } from "../resources/StockRessource";
import { FinancialSecurityResourceInterface } from "../../../../application/services/api/resources/FinancialSecurityResourceInterface";
import { FinancialSecurityResource } from "../resources/FinancialSecurityResource";
import { BeneficiaryResourceInterface } from "../../../../application/services/api/resources/BeneficiaryResourceInterface";
import { BeneficiaryResource } from "../resources/BeneficiaryResource";
import { BankCreditResourceInterface } from "../../../../application/services/api/resources/BankCreditResourceInterface";
import { BankCreditResource } from "../resources/BankCreditResource";
import { StockOrderResourceInterface } from "../../../../application/services/api/resources/StockOrderResourceInterface";
import { StockOrderResource } from "../resources/StockOrderResource";
import { NewsResourceInterface } from "../../../../application/services/api/resources/NewsResourceInterface";
import { NewsResource } from "../resources/NewsResource";
import { PrivateMessageResourceInterface } from "../../../../application/services/api/resources/PrivateMessageResourceInterface";
import { PrivateChannelResourceInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { CompanyChannelResourceInterface } from "../../../../application/services/api/resources/CompanyChannelResourceInterface";
import { NotificationResourceInterface } from "../../../../application/services/api/resources/NotificationResourceInterface";
import { PrivateMessageResource } from "../resources/PrivateMessageRessource";
import { PrivateChannelResource } from "../resources/PrivateChannelRessource";
import { CompanyChannelResource } from "../resources/CompanyChannelRessource";
import { NotificationResource } from "../resources/NotificationRessource";

export class ApiClient implements ApiClientInterface {
  private token: string | null = null;

  public me: MeResourceInterface;
  public user: UserResourceInterface;
  public account: AccountResourceInterface;
  public operation: OperationResourceInterface;
  public setting: SettingResourceInterface;
  public stock: StockResourceInterface;
  public stockOrder: StockOrderResourceInterface;
  public financialSecurity: FinancialSecurityResourceInterface;
  public beneficiary: BeneficiaryResourceInterface;
  public bankCredit: BankCreditResourceInterface;
  public news: NewsResourceInterface;
  public privateMessage: PrivateMessageResourceInterface;
  public privateChannel: PrivateChannelResourceInterface;
  public companyChannel: CompanyChannelResourceInterface;
  public notification: NotificationResourceInterface;

  constructor(private baseUrl: string) {
    this.me = new MeResource(this);
    this.user = new UserResource(this);
    this.account = new AccountResource(this);
    this.operation = new OperationResource(this);
    this.setting = new SettingResource(this);
    this.stock = new StockResource(this);
    this.stockOrder = new StockOrderResource(this);
    this.financialSecurity = new FinancialSecurityResource(this);
    this.beneficiary = new BeneficiaryResource(this);
    this.bankCredit = new BankCreditResource(this);
    this.news = new NewsResource(this);
    this.privateMessage = new PrivateMessageResource(this);
    this.privateChannel = new PrivateChannelResource(this);
    this.companyChannel = new CompanyChannelResource(this);
    this.notification = new NotificationResource(this);

    this.token = getCookie("token");
  }

  public async get<T>(url: string, additionnalHeaders: HeadersInit = {}): Promise<T | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      headers: {
        Accept: "application/json",
        ...additionnalHeaders,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch((error: ApiClientError) => error);
  }

  public async post<T>(url: string, body: object = {}, additionnalHeaders: HeadersInit = {}): Promise<T | ApiClientError> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData
      ? {
          Accept: "application/json",
          ...additionnalHeaders,
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...additionnalHeaders,
        };

    return fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        ...headers,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch((error: ApiClientError) => error);
  }

  public async put<T>(url: string, body: object = {}, additionnalHeaders: HeadersInit = {}): Promise<T | ApiClientError> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData
      ? {
          Accept: "application/json",
          ...additionnalHeaders,
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...additionnalHeaders,
        };

    return fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: {
        ...headers,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch((error: ApiClientError) => error);
  }

  public async delete(url: string): Promise<DeleteResponseInterface | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: {
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    })
      .then(handleApiError)
      .then((response) => ({ success: response.status === 204 }))
      .catch((error: ApiClientError) => error);
  }

  public async login(email: string, password: string): Promise<LoginResponseInterface | ApiClientError> {
    return this.post<LoginResponseInterface>(paths.login, { email, password })
      .then((response) => {
        if (response instanceof ApiClientError) {
          throw response;
        }

        if (response.token) {
          const decodedTokenExp: number = JSON.parse(atob(response.token.split(".")[1]))?.exp ?? 0;
          setCookie("token", response.token, new Date(decodedTokenExp * 1000));
          this.token = response.token;
        }

        return response;
      })
      .then(async (response) => {
        if (response.token) {
          return {
            ...response,
            user: await this.me.get().then((user) => user),
          };
        }

        return response;
      })
      .catch((error: ApiClientError) => error);
  }

  public async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<RegisterResponseInterface | ApiClientError> {
    return this.post<RegisterResponseInterface>(paths.register, {
      email,
      password,
      firstName,
      lastName,
    });
  }

  public async confirm(token: string): Promise<ConfirmResponseInterface | ApiClientError> {
    return this.post<ConfirmResponseInterface>(paths.confirm, { token });
  }

  public logout(): void {
    this.token = null;
    eraseCookie("token");
  }
}

