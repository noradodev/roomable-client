export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  city: string;
  description: string | null;
  image_url: string | null;
  is_active: number;
  remaining_rooms: number;
  renting_rooms: number;
  total_rooms: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  floor_number: string;
  rooms: Room[];
}
export interface Room {
  id: string;
  room_number: string;
  room_type: string ;
   price: number;
  status: "available" | "occupied" | "maintenance";
  current_tenant_id?: string | null | undefined;
}
