import { z } from 'zod'

const jsonLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])

const jsonShallowSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(jsonLiteralSchema),
  z.record(jsonLiteralSchema),
])

// define a 2-levels nested json schema, as that's all we need at the moment.
// Feel free to add levels or define an infinitely-nested schema if needed, but
// Typescript seems to complain about it
export const jsonNestedSchema = z.union([
  jsonShallowSchema,
  z.array(jsonShallowSchema),
  z.record(jsonShallowSchema),
])

export type JsonNestedSchema = z.input<typeof jsonNestedSchema>

export const getJsonOrEmptyObj = (val: unknown) => {
  if (typeof val === 'object') {
    if (val === null) {
      return {}
    }
    return val
  }
  if (typeof val !== 'string') return {}
  try {
    return JSON.parse(val) ?? {}
  } catch {}
  return {}
}
