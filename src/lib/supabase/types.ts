export type PropertyType =
  | 'single_family'
  | 'multi_family'
  | 'commercial'
  | 'land'

export type ListingStatus = 'draft' | 'active' | 'under_contract' | 'closed'

export type PropertyListingRow = {
  id: string
  sponsor_id: string
  title: string
  summary: string
  property_type: PropertyType
  address_line1: string
  address_line2: string | null
  city: string
  region: string
  postal_code: string
  country: string
  asking_price: number
  currency: string
  status: ListingStatus
  created_at: string
  updated_at: string
}

export type PropertyListingInsert = {
  id?: string
  sponsor_id: string
  title: string
  summary: string
  property_type: PropertyType
  address_line1: string
  address_line2?: string | null
  city: string
  region: string
  postal_code: string
  country: string
  asking_price: number
  currency: string
  status: ListingStatus
  created_at?: string
  updated_at?: string
}

export type PropertyListingUpdate = {
  id?: string
  sponsor_id?: string
  title?: string
  summary?: string
  property_type?: PropertyType
  address_line1?: string
  address_line2?: string | null
  city?: string
  region?: string
  postal_code?: string
  country?: string
  asking_price?: number
  currency?: string
  status?: ListingStatus
  created_at?: string
  updated_at?: string
}

export type Database = {
  public: {
    Tables: {
      property_listings: {
        Row: PropertyListingRow
        Insert: PropertyListingInsert
        Update: PropertyListingUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
