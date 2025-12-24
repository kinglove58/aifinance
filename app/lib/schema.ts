import { z } from "zod";

export const AccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.coerce
    .number({ invalid_type_error: "Balance is required" })
    .min(0, "Balance must be greater than or equal to 0"),
  isDefault: z.boolean().default(false),
});
