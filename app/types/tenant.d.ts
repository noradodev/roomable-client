
export interface Tenant {
  id: string;
  name: string;
  email: string;
  status: string;
  move_in_date: string;
  move_out_date: string | null;
  current_tenancy?: { 
    room_number: string;
    property_name: string;
  } | null;
  
  phone: string | null;
  telegram_id: string | null;
  notes: string | null;
  due_date: string; 
  telegram_id: string | null;
  telegram_chat_id: string | null
  telegram_link?: string | undefined | null; 
}

export interface CreateTenantInput {
  name: string
  email: string
  phone: string
  notes?: string
  move_in_date: string
  due_date: string
  status?: 'unassigned' | 'assigned' | 'active' | 'inactive'
}
export interface UpdateTenantInput {
  name?: string
  email?: string
  phone?: string
  notes?: string
  move_in_date?: string
  due_date?: string
  status?: 'unassigned' | 'assigned' | 'active' | 'inactive'
  move_out_date?: string | null
}