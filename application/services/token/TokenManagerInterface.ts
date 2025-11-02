import { TokenPayload, TokenPayloadValue } from '../../../domain/values/TokenPayloadValue'; 

export interface TokenManagerInterface {
  generate(payload: TokenPayloadValue): string;
  verify(token: string): TokenPayload | null;
}
