import { z } from 'zod'

export const roomSchema = (t: (key: string) => string) => z.object({
  roomNumber: z.string().min(1, t("validation_message.room_number_required")),
  type: z.string().min(1, t("validation_message.room_type_required")),
  price: z.coerce.number().min(1, t("validation_message.price_required")), 
})

export const floorSchema  = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("validation_message.floor_name_required")),
  number: z.coerce.number().min(1, t("validation_message.floor_number_required")), 
  rooms: z.array(roomSchema(t)).min(1, t("validation_message.floor_min_one_room")),
})

export const roomSetupSchema = (t: (key: string) => string) => z.object({
  floors: z.array(floorSchema(t)).min(1, t("validation_message.min_one_floor")),
})

export type RoomSetupSchema = z.output<ReturnType<typeof roomSetupSchema>>
