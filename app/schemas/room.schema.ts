import { z } from 'zod'

export const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  type: z.string().min(1, 'Room type is required'),
  price: z.coerce.number().min(1, 'Price is required'), 
})

export const floorSchema = z.object({
  name: z.string().min(1, 'Floor name is required'),
  number: z.coerce.number().min(1, 'Floor number is required'), 
  rooms: z.array(roomSchema).min(1, 'Each floor must have at least one room'),
})

export const roomSetupSchema = z.object({
  floors: z.array(floorSchema).min(1, 'At least one floor is required'),
})

export type RoomSetupSchema = z.infer<typeof roomSetupSchema>
