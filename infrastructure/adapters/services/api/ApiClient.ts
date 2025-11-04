import { ApiClientInterface, LoginResponseInterface, RegisterResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { MeResourceInterface } from "../../../../application/services/api/resources/MeResourceInterface";
import { eraseCookie, getCookie, setCookie } from "../../../utils/frontend/cookies";
import { MeResource } from "./resources/MeResource";

export class ApiClient implements ApiClientInterface {
  private token: string | null = null;

  public me: MeResourceInterface;

  constructor(private baseUrl: string) {
    this.me = new MeResource(this);

    this.token = getCookie("token");
  }

  public async get<T>(url: string, additionnalHeaders: HeadersInit = {}): Promise<T> {
    return fetch(`${this.baseUrl}${url}`, {
      headers: {
        Accept: "application/json",
        ...additionnalHeaders,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    }).then((response) => response.json());
  }

  public async post<T>(url: string, body: object = {}, additionnalHeaders: HeadersInit = {}): Promise<T> {
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
    }).then((response) => response.json());
  }

  // TODO
  // public async delete(url: string): Promise<DeleteResponse> {
  //   return fetch(`${this.baseUrl}${url}`, {
  //     method: "DELETE",
  //     headers: {
  //       ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
  //     },
  //   }).then((response) => ({ success: response.status === 204 }));
  // }

  public async login(email: string, password: string): Promise<LoginResponseInterface> {
    return this.post<LoginResponseInterface>(paths.login, { email, password })
      .then((response) => {
        if (response.token) {
          const decodedTokenExp: number = JSON.parse(atob(response.token.split(".")[1]))?.exp ?? 0;
          setCookie("token", response.token, new Date(decodedTokenExp));
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
      });
  }

  public async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<RegisterResponseInterface> {
    return this.post<RegisterResponseInterface>(paths.register, {
      email,
      password,
      firstName,
      lastName,
    });
  }

  public logout(): void {
    this.token = null;
    eraseCookie("token");
  }
}

