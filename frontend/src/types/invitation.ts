export interface ApiPerson {
  full_name?: string | null;
  nick_name?: string | null;
  child_order?: number | null;
  father_name?: string | null;
  mother_name?: string | null;
  address?: string | null;
  instagram_username?: string | null;
}

export interface ApiQuote {
  quote?: string | null;
  author?: string | null;
}

export interface ApiDesign {
  name?: string | null;
  description?: string | null;
  sample_link?: string | null;
  main_sample_url?: string | null;
  secondary_sample_url?: string | null;
  third_sample_url?: string | null;
}

export interface ApiLocation {
  name?: string | null;
  address_line?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  map_link?: string | null;
}

export interface ApiEvent {
  id: number;
  event_type: string;
  start_at?: string | null;
  end_at?: string | null;
  notes?: string | null;
  location?: ApiLocation | null;
}

export interface ApiGalleryItem {
  subject?: string | null;
  slot?: string | null;
  sort_order?: number | null;
  image_url?: string | null;
}

export interface ApiInvitation {
  id: number;
  slug: string;
  wedding_date?: string | null;
  design_id?: number | null;
  groom?: ApiPerson | null;
  bride?: ApiPerson | null;
  quote?: ApiQuote | null;
  design?: ApiDesign | null;
  events_count?: number | null;
  events?: ApiEvent[];
  gallery?: ApiGalleryItem[];
  created_at?: string | null;
  updated_at?: string | null;
}