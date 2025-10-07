import { z } from 'zod'

export const roomSchema = (t: (key: string) => string) => z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  type: z.string().min(1, 'Room type is required'),
  price: z.coerce.number().min(1, 'Price is required'), 
})

export const floorSchema  = (t: (key: string) => string) => z.object({
  name: z.string().min(1, 'Floor name is required'),
  number: z.coerce.number().min(1, 'Floor number is required'), 
  rooms: z.array(roomSchema(t)).min(1, 'Each floor must have at least one room'),
})

export const roomSetupSchema = (t: (key: string) => string) => z.object({
  floors: z.array(floorSchema(t)).min(1, 'At least one floor is required'),
})

export type RoomSetupSchema = z.output<ReturnType<typeof roomSetupSchema>>
