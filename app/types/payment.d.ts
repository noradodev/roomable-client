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
