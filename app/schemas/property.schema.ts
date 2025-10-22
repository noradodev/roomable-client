import { z } from "zod";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  formatBytes,
} from "~/utils/image";

export const propertySchema = (t: (key: string, param?: Record<string, any>) => string) => z.object({
  name: z.string().min(1, t("validation_message.name_required")),
  address: z.string().min(1, t("validation_message.address_required")),
  city: z.string().min(1, t("validation_message.city_required")),
  description: z.string().optional(),
  props_image: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `${t("validation_message.image_too_large")} ${formatBytes(
          MAX_FILE_SIZE
        )}.`,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: t("validation_message.image_too_large"),
      }),
    z.undefined(),
  ]),
  
});

export type PropertySchema = z.output<ReturnType<typeof propertySchema>>;
