import { TypeOf, z } from 'zod';

export const withDevDefault = <T extends z.ZodTypeAny>(
  schema: T,
  value: TypeOf<T>
) =>
  process.env['NODE_ENV'] === 'production' ? schema : schema.default(value);
