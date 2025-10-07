import { reactive } from 'vue'
import type { RoomSetupSchema } from '~/schemas/room.schema'

export function useRoomSetup(initial?: RoomSetupSchema) {
  const state = reactive<RoomSetupSchema>(
    initial ?? {
      floors: [],
    }
  )

  const addFloor = () => {
    state.floors.push({
      name: '',
      number: state.floors.length + 1,
      rooms: [],
    })
  }

  const removeFloor = (index: number) => {
    state.floors.splice(index, 1)
  }

  const addRoom = (floorIndex: number) => {
    state.floors[floorIndex]?.rooms.push({
      roomNumber: '',
      type: '',
      price: 0,
    })
  }

  const removeRoom = (floorIndex: number, roomIndex: number) => {
    state.floors[floorIndex]?.rooms.splice(roomIndex, 1)
  }

  return { state, addFloor, removeFloor, addRoom, removeRoom }
}