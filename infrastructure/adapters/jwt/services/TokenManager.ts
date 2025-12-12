import jwt from 'jsonwebtoken';
import { TokenPayload, TokenPayloadValue } from '../../../../domain/values/TokenPayloadValue';

export class TokenManager {
  public constructor(
    private readonly jwtSecret: string
  ) {}

  public generate(payloadValue: TokenPayloadValue): string {
    return jwt.sign({
      data: {
        id: payloadValue.value.id,
      },
    }, this.jwtSecret, {
      expiresIn: '2h',
    });
  }

  public verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      if (typeof decoded === 'string' || !decoded.data || !decoded.data.id) {
        return null;
      }

      return { id: decoded.data.id };
    } catch (error) {
      return null;
    }
  }
}
