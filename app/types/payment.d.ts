export interface PaymentMethodType {
  id: number;
  code: string;
  name: string;
  is_required: boolean | number;
  display_order: number;
}

export interface PaymentConfiguration {
  collector_name: string;
  collection_location: string;
  instructions: string | null;
  account_name: string | null;
}

export interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  is_enabled: boolean;
  is_required: boolean;
  configuration: PaymentConfiguration; 
  qr_image_url: string | null;
}



export interface PaymentItem {
    id: string; 
    tenant_name: string;
    room_number: string;
    
    amount: number;
    electricity_cost: number;
    water_cost: number;
    total_amount: number;

    status: 'paid' | 'awaiting_confirmation' | 'awaiting_tenant';
    month_years: string; 
    method: 'cash' | 'bank' | 'qr' | 'other' | null;
    note: string | null;
    rejection_reason: string | null;
    proof_of_payment_url: string | null;

    created_at: string | null; 
    paid_at: string | null;   
    due_date: string | null;   
}