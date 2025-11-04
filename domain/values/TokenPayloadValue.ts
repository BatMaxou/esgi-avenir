export interface TokenPayload {
  id?: number;
};

export class TokenPayloadValue {
  public static from(value: TokenPayload): TokenPayloadValue {
    return new TokenPayloadValue(value);
  }

  private constructor(public value: TokenPayload) {}
}

