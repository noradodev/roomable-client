import { z } from "zod";

export const landlordPaymentSchema = (
  t: (key: string, param?: Record<string, any>) => string
) =>
  z.object({
    cash: z.object({
      enabled: z.boolean(),
      collector_name: z
        .string()
        .min(1, t("validation.required", { field: "Collector Name" }))
        .optional()
        .or(z.literal("").refine(() => false, {
          message: t("validation.required", { field: "Collector Name" }),
        })),
      collection_location: z
        .string()
        .optional(),
    })
    .refine(
      (data) => {
        // if cash enabled, collector_name must not be empty
        if (data.enabled && !data.collector_name?.trim()) return false;
        return true;
      },
      {
        message: t("validation.required", { field: "Collector Name" }),
        path: ["collector_name"],
      }
    ),

    qr: z.object({
      enabled: z.boolean(),
      name: z
        .string()
        .min(1, t("validation.required", { field: "QR Payment Name" }))
        .optional(),
      // optional qr_image (file or string)
      qr_image: z.any().optional(),
    })
    .refine(
      (data) => {
        // if QR enabled, name must be provided
        if (data.enabled && !data.name?.trim()) return false;
        return true;
      },
      {
        message: t("validation.required", { field: "QR Payment Name" }),
        path: ["name"],
      }
    ),
  });
