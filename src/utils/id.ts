import { nanoid } from 'nanoid';

/** Stable, collision-resistant id for a field. Generated once per field. */
export function createId(): string {
  return nanoid(10);
}
