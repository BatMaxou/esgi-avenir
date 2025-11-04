import { compareSync, hashSync } from "bcrypt";

import { PasswordHasherInterface } from "../../../../application/services/password/PasswordHasherInterface";

export class PasswordHasher implements PasswordHasherInterface {
  public createHash(plainPassword: string): string {
    return hashSync(plainPassword, 10);
  }

  public verify(plainPassword: string, hashedPassword: string): boolean {
    return compareSync(plainPassword, hashedPassword);
  }
}
