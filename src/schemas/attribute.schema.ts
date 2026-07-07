import { z } from "zod";

// --- Condition ---
const ConditionValue = z.union([
  z.string(),
  z.number(),
  z
    .object({
      lt: z.number().optional(),
      gt: z.number().optional(),
      in: z.array(z.union([z.string(), z.number()])).optional(),
    })
    .strict(),
]);

export const ConditionSchema = z.record(z.string(), ConditionValue);

const OptionValueSchema = z.union([z.string(), z.number()]);

const OptionRefSchema = z.object({
  value: OptionValueSchema,
  weight: z.number().positive().optional(),
  pools: z.array(z.string()).optional(),
});

const PoolRefSchema = z.object({
  pool: z.string(),
  weight: z.number().positive().optional(),
});

export const EffectSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("reweight"),
    multiply: z.record(z.string(), z.number().positive()),
  }),
  z.object({
    type: z.literal("override"),
    value: z.union([z.string(), z.number()]),
  }),
  z.object({
    type: z.literal("add_options"),
    options: z.array(OptionRefSchema),
  }),
  z.object({
    type: z.literal("remove_options"),
    options: z.array(OptionRefSchema),
  }),
  z.object({
    type: z.literal("use_pools"),
    pools: z.array(PoolRefSchema),
  }),
]);

// --- Rule ---
export const RuleSchema = z.object({
  when: ConditionSchema,
  effect: EffectSchema,
});

// --- Attribute ---
export const AttributeSchema = z.object({
  key: z.string(),
  dependsOn: z.array(z.string()),
  options: z.array(z.string()),
  rules: z.array(RuleSchema),
});

export const AttributeFileSchema = z.array(AttributeSchema);
export const OptionFileSchema = z.array(OptionRefSchema);

// Types inférés — remplacent tes types manuels, garantit zéro dérive schéma/type
export type Condition = z.infer<typeof ConditionSchema>;
export type Effect = z.infer<typeof EffectSchema>;
export type Rule = z.infer<typeof RuleSchema>;
export type Attribute = z.infer<typeof AttributeSchema>;
export type Option = z.infer<typeof OptionRefSchema>;
export type OptionValue = z.infer<typeof OptionValueSchema>;
