import { z } from "zod";
import {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  formatBytes,
} from "~/utils/image";

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  description: z.string().optional(),
  props_image: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `The image is too large. Please choose an image smaller than ${formatBytes(
          MAX_FILE_SIZE
        )}.`,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Please upload a valid image file (JPEG, PNG, or WebP).",
      }),
    z.undefined(),
  ]),
});

export type PropertySchema = z.output<typeof propertySchema>;
