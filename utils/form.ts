import { z } from 'zod'

export const ZodJson = z.string().refine(
  val => {
    if (val === '') {
      return true
    }
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  },
  { message: 'must be valid json' },
)

const emptyStringToUndefined = z.literal('').transform(() => undefined)

export function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined)
}
