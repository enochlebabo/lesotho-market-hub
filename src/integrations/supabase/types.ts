export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advertisements: {
        Row: {
          ad_description: string | null
          ad_image_url: string | null
          ad_title: string
          ad_type: string
          click_count: number | null
          created_at: string | null
          end_date: string
          id: string
          impression_count: number | null
          is_active: boolean | null
          monthly_fee: number
          start_date: string | null
          target_category: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ad_description?: string | null
          ad_image_url?: string | null
          ad_title: string
          ad_type: string
          click_count?: number | null
          created_at?: string | null
          end_date: string
          id?: string
          impression_count?: number | null
          is_active?: boolean | null
          monthly_fee: number
          start_date?: string | null
          target_category?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ad_description?: string | null
          ad_image_url?: string | null
          ad_title?: string
          ad_type?: string
          click_count?: number | null
          created_at?: string | null
          end_date?: string
          id?: string
          impression_count?: number | null
          is_active?: boolean | null
          monthly_fee?: number
          start_date?: string | null
          target_category?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      business_accounts: {
        Row: {
          business_name: string
          business_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          monthly_fee: number | null
          plan_end_date: string | null
          plan_start_date: string | null
          plan_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_name: string
          business_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number | null
          plan_end_date?: string | null
          plan_start_date?: string | null
          plan_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_name?: string
          business_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number | null
          plan_end_date?: string | null
          plan_start_date?: string | null
          plan_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_category_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_category_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_options: {
        Row: {
          base_delivery_fee: number | null
          created_at: string | null
          delivery_radius_km: number | null
          delivery_type: string
          estimated_delivery_time: string | null
          id: string
          is_active: boolean | null
          listing_id: string
          per_km_rate: number | null
          seller_id: string
        }
        Insert: {
          base_delivery_fee?: number | null
          created_at?: string | null
          delivery_radius_km?: number | null
          delivery_type: string
          estimated_delivery_time?: string | null
          id?: string
          is_active?: boolean | null
          listing_id: string
          per_km_rate?: number | null
          seller_id: string
        }
        Update: {
          base_delivery_fee?: number | null
          created_at?: string | null
          delivery_radius_km?: number | null
          delivery_type?: string
          estimated_delivery_time?: string | null
          id?: string
          is_active?: boolean | null
          listing_id?: string
          per_km_rate?: number | null
          seller_id?: string
        }
        Relationships: []
      }
      premium_listings: {
        Row: {
          created_at: string | null
          end_date: string
          fee_amount: number
          id: string
          is_active: boolean | null
          listing_id: string
          premium_type: string
          start_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          fee_amount: number
          id?: string
          is_active?: boolean | null
          listing_id: string
          premium_type: string
          start_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          fee_amount?: number
          id?: string
          is_active?: boolean | null
          listing_id?: string
          premium_type?: string
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          buyer_id: string
          created_at: string | null
          expires_at: string
          id: string
          payment_method: string
          payment_reference: string | null
          refunded_at: string | null
          released_at: string | null
          reservation_amount: number
          seller_id: string
          status: string | null
          transaction_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          payment_method: string
          payment_reference?: string | null
          refunded_at?: string | null
          released_at?: string | null
          reservation_amount: number
          seller_id: string
          status?: string | null
          transaction_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          payment_method?: string
          payment_reference?: string | null
          refunded_at?: string | null
          released_at?: string | null
          reservation_amount?: number
          seller_id?: string
          status?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_reviews: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          rating: number
          response_time_rating: number | null
          review_text: string | null
          seller_id: string
          transaction_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          rating: number
          response_time_rating?: number | null
          review_text?: string | null
          seller_id: string
          transaction_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          response_time_rating?: number | null
          review_text?: string | null
          seller_id?: string
          transaction_id?: string
        }
        Relationships: []
      }
      seller_verification: {
        Row: {
          created_at: string | null
          government_id_url: string | null
          id: string
          mobile_verified: boolean | null
          social_media_link: string | null
          updated_at: string | null
          user_id: string
          verification_badges: Json | null
          verification_documents: Json | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          government_id_url?: string | null
          id?: string
          mobile_verified?: boolean | null
          social_media_link?: string | null
          updated_at?: string | null
          user_id: string
          verification_badges?: Json | null
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          government_id_url?: string | null
          id?: string
          mobile_verified?: boolean | null
          social_media_link?: string | null
          updated_at?: string | null
          user_id?: string
          verification_badges?: Json | null
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          agreed_price: number
          buyer_id: string
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_distance_km: number | null
          delivery_fee: number | null
          delivery_option: string | null
          id: string
          listing_id: string
          product_name: string
          receipt_generated: boolean | null
          receipt_url: string | null
          reservation_fee: number | null
          seller_id: string
          status: string | null
        }
        Insert: {
          agreed_price: number
          buyer_id: string
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_distance_km?: number | null
          delivery_fee?: number | null
          delivery_option?: string | null
          id?: string
          listing_id: string
          product_name: string
          receipt_generated?: boolean | null
          receipt_url?: string | null
          reservation_fee?: number | null
          seller_id: string
          status?: string | null
        }
        Update: {
          agreed_price?: number
          buyer_id?: string
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_distance_km?: number | null
          delivery_fee?: number | null
          delivery_option?: string | null
          id?: string
          listing_id?: string
          product_name?: string
          receipt_generated?: boolean | null
          receipt_url?: string | null
          reservation_fee?: number | null
          seller_id?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_seller_rating: {
        Args: { seller_user_id: string }
        Returns: {
          average_rating: number
          total_reviews: number
          response_time_rating: number
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      update_seller_badges: {
        Args: { seller_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
