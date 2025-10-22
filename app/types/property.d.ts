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
export interface PaymentTrendData {
    month: string;      // Format: 'YYYY-MM'
    total: number;
}

export interface DashboardStaticAssets {
    buildings: number;
    rooms: number;
    tenants: number;
}

export interface DashboardPaymentStats {
    current_month_key: string;          // Format: 'YYYY-MM'
    current_month_total: number;
    last_month_total: number;
    mom_change_amount: number;
    mom_change_percentage: number;
    trend_data: PaymentTrendData[];     // Array of PaymentTrendData
}

export interface DashboardData {
    static_assets: DashboardStaticAssets;
    payments: DashboardPaymentStats;
}

export interface DashboardApiResponse {
    status: 'success' | 'error'; // Assuming status can also be 'error'
    data: DashboardData;
}