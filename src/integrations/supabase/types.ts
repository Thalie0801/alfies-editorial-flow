export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          brand_id: string | null
          created_at: string | null
          cta: string | null
          hashtags: string[] | null
          id: string
          idea_id: string | null
          meta: Json | null
          moderation_notes: string | null
          platform: string | null
          ratio: string | null
          slides: Json | null
          source_url: string | null
          status: string | null
          suggested_time: string | null
          text_content: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          cta?: string | null
          hashtags?: string[] | null
          id?: string
          idea_id?: string | null
          meta?: Json | null
          moderation_notes?: string | null
          platform?: string | null
          ratio?: string | null
          slides?: Json | null
          source_url?: string | null
          status?: string | null
          suggested_time?: string | null
          text_content?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          cta?: string | null
          hashtags?: string[] | null
          id?: string
          idea_id?: string | null
          meta?: Json | null
          moderation_notes?: string | null
          platform?: string | null
          ratio?: string | null
          slides?: Json | null
          source_url?: string | null
          status?: string | null
          suggested_time?: string | null
          text_content?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      assets_media: {
        Row: {
          asset_id: string | null
          created_at: string | null
          id: string
          kind: string | null
          meta: Json | null
          url: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          kind?: string | null
          meta?: Json | null
          url: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          kind?: string | null
          meta?: Json | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_media_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_members: {
        Row: {
          brand_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          brand_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          brand_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_members_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          palette: Json | null
          voice_guidelines: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          palette?: Json | null
          voice_guidelines?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          palette?: Json | null
          voice_guidelines?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          brand_id: string | null
          created_at: string | null
          created_by: string | null
          hooks: string[] | null
          id: string
          source_url: string | null
          status: string | null
          summary: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          hooks?: string[] | null
          id?: string
          source_url?: string | null
          status?: string | null
          summary?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          hooks?: string[] | null
          id?: string
          source_url?: string | null
          status?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          clicks: number | null
          collected_at: string | null
          comments: number | null
          ctr: number | null
          id: string
          impressions: number | null
          likes: number | null
          reach: number | null
          schedule_id: string | null
          shares: number | null
        }
        Insert: {
          clicks?: number | null
          collected_at?: string | null
          comments?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          reach?: number | null
          schedule_id?: string | null
          shares?: number | null
        }
        Update: {
          clicks?: number | null
          collected_at?: string | null
          comments?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          reach?: number | null
          schedule_id?: string | null
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_limits: {
        Row: {
          articles: number
          carousels: number
          covers: number
          hero: number
          networks: number
          plan_key: string
          posts: number
          snacks: number
          stories: number
        }
        Insert: {
          articles?: number
          carousels?: number
          covers?: number
          hero?: number
          networks?: number
          plan_key: string
          posts?: number
          snacks?: number
          stories?: number
        }
        Update: {
          articles?: number
          carousels?: number
          covers?: number
          hero?: number
          networks?: number
          plan_key?: string
          posts?: number
          snacks?: number
          stories?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          platform_role: Database["public"]["Enums"]["platform_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          platform_role?: Database["public"]["Enums"]["platform_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          platform_role?: Database["public"]["Enums"]["platform_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          asset_id: string | null
          channel: string | null
          created_at: string | null
          error: string | null
          external_post_id: string | null
          id: string
          planned_at: string | null
          status: string | null
        }
        Insert: {
          asset_id?: string | null
          channel?: string | null
          created_at?: string | null
          error?: string | null
          external_post_id?: string | null
          id?: string
          planned_at?: string | null
          status?: string | null
        }
        Update: {
          asset_id?: string | null
          channel?: string | null
          created_at?: string | null
          error?: string | null
          external_post_id?: string | null
          id?: string
          planned_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          price_lookup_key: string | null
          status: string
          trial_end: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          id: string
          period_end?: string | null
          period_start?: string | null
          price_lookup_key?: string | null
          status: string
          trial_end?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          price_lookup_key?: string | null
          status?: string
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          articles_used: number | null
          carousels_used: number | null
          covers_used: number | null
          created_at: string | null
          hero_used: number | null
          id: string
          month_year: string
          posts_used: number | null
          snacks_used: number | null
          stories_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          articles_used?: number | null
          carousels_used?: number | null
          covers_used?: number | null
          created_at?: string | null
          hero_used?: number | null
          id?: string
          month_year: string
          posts_used?: number | null
          snacks_used?: number | null
          stories_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          articles_used?: number | null
          carousels_used?: number | null
          covers_used?: number | null
          created_at?: string | null
          hero_used?: number | null
          id?: string
          month_year?: string
          posts_used?: number | null
          snacks_used?: number | null
          stories_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_month_year: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_or_create_usage_tracking: {
        Args: { user_id_param: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_brand_member: {
        Args: { _brand: string }
        Returns: boolean
      }
    }
    Enums: {
      platform_role: "viewer" | "super_admin" | "ops" | "finance"
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      platform_role: ["viewer", "super_admin", "ops", "finance"],
      user_role: ["admin", "client"],
    },
  },
} as const
