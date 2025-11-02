import { v4 as uuidv4 } from 'uuid';

export class UniqueIdGenerator {
  public generate(): string {
    return uuidv4();
  }
}
