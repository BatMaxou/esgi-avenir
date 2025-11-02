export class HashedPasswordValue {
  public static from(value: string): HashedPasswordValue {
    return new HashedPasswordValue(value);
  }

  private constructor(public value: string) {}
}
