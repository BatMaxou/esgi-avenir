export interface PasswordHasherInterface {
  verify(plainPassword: string, hashedPassword: string): boolean
  createHash(plainPassword: string): string
}
